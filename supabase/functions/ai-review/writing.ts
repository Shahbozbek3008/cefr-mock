import type { Locale } from "./claude.ts";
import { askStructured, feedbackLanguage } from "./claude.ts";
import type { Mark, Segment } from "./segments.ts";
import {
  MAX_SCORE,
  alignSegments,
  countWords,
  levelFor,
  segmentSchema,
} from "./segments.ts";

export type WritingTask = {
  id: string;
  label: string;
  kind: string;
  context?: string;
  prompt: string;
  targetWords: number;
  minWords: number;
};

const CRITERIA = [
  "Task achievement",
  "Coherence",
  "Lexical resource",
  "Grammar",
] as const;
const CRITERION_MAX = 20;

type Criterion = { label: string; score: number; max: number };
type Correction = { from: string; to: string; note: string };

type TaskAssessment = {
  taskId: string;
  criteria: { label: (typeof CRITERIA)[number]; score: number }[];
  summary: string;
  segments: { text: string; mark: Mark | "none" }[];
  corrections: Correction[];
  improved: string;
};

export type WritingTaskReview = {
  taskId: string;
  label: string;
  words: number;
  score: number;
  level: string;
  summary: string;
  criteria: Criterion[];
  segments: Segment[];
  corrections: Correction[];
  improved: string;
};

export type WritingReview = { score: number; tasks: WritingTaskReview[] };

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["tasks"],
  properties: {
    tasks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "taskId",
          "criteria",
          "summary",
          "segments",
          "corrections",
          "improved",
        ],
        properties: {
          taskId: { type: "string" },
          criteria: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "score"],
              properties: {
                label: { type: "string", enum: [...CRITERIA] },
                score: { type: "integer" },
              },
            },
          },
          summary: { type: "string" },
          segments: segmentSchema(["grammar", "lexis", "good"]),
          corrections: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["from", "to", "note"],
              properties: {
                from: { type: "string" },
                to: { type: "string" },
                note: { type: "string" },
              },
            },
          },
          improved: { type: "string" },
        },
      },
    },
  },
};

const systemPrompt = (
  locale: Locale,
) => `You are a senior examiner for the Uzbekistan national CEFR multilevel English exam, Writing paper.
Assess each response strictly, consistently and fairly, the way an official rater would.

The paper has three tasks based on the official format:
- Task 1.1: an informal letter or message to a friend, about 50 words, based on the situation.
- Task 1.2: a formal letter on the same situation, 120-150 words.
- Task 2: an essay expressing and supporting an opinion, at least 180 words.

Score every task on four criteria, each an integer from 0 to ${CRITERION_MAX}: ${CRITERIA.join(", ")}.
Calibration per criterion: 17-20 = C1 performance, 14-16 = B2, 10-13 = B1, 5-9 = A2, 0-4 = below A2.
Task achievement includes covering every point of the prompt and using the right register: friendly and informal in Task 1.1, polite and formal in Task 1.2, academic in Task 2.
Penalise responses that are off-topic, in the wrong register, far below the required word count, or copied from the prompt.

For each task also return:
- summary: two short sentences on the main strength and the most important thing to improve, written in ${feedbackLanguage[locale]}.
- segments: the candidate's text split into consecutive pieces that reproduce it exactly, character for character, when joined. Mark grammar errors as "grammar", wrong or weak word choice as "lexis", a few genuinely strong phrases as "good", everything else as "none".
- corrections: up to 8 of the most useful fixes. "from" and "to" are English text; "note" explains the rule briefly in ${feedbackLanguage[locale]}.
- improved: a corrected, more natural version in English that keeps the candidate's ideas, structure and approximate length.`;

const taskPrompt = (
  task: WritingTask,
  text: string,
) => `<task id="${task.id}" label="${task.label}" type="${task.kind}" target_words="${task.targetWords}" min_words="${task.minWords}">
${task.context ? `<situation>${task.context}</situation>\n` : ""}<prompt>${task.prompt}</prompt>
<response words="${countWords(text)}">${text}</response>
</task>`;

const taskScore = (criteria: Criterion[]) =>
  Math.round(
    (MAX_SCORE * criteria.reduce((sum, c) => sum + c.score, 0)) /
      (CRITERIA.length * CRITERION_MAX),
  );

const emptyReview = (task: WritingTask): WritingTaskReview => ({
  taskId: task.id,
  label: task.label,
  words: 0,
  score: 0,
  level: levelFor(0),
  summary: "",
  criteria: CRITERIA.map((label) => ({ label, score: 0, max: CRITERION_MAX })),
  segments: [],
  corrections: [],
  improved: "",
});

const toReview = (
  task: WritingTask,
  text: string,
  assessment: TaskAssessment | undefined,
): WritingTaskReview => {
  if (!assessment) return emptyReview(task);
  const criteria = CRITERIA.map((label) => ({
    label,
    score: Math.max(
      0,
      Math.min(
        CRITERION_MAX,
        assessment.criteria.find((c) => c.label === label)?.score ?? 0,
      ),
    ),
    max: CRITERION_MAX,
  }));
  const score = taskScore(criteria);
  return {
    taskId: task.id,
    label: task.label,
    words: countWords(text),
    score,
    level: levelFor(score),
    summary: assessment.summary,
    criteria,
    segments: alignSegments(text, assessment.segments),
    corrections: assessment.corrections,
    improved: assessment.improved,
  };
};

export const reviewWriting = async (
  tasks: WritingTask[],
  answers: Record<string, string>,
  locale: Locale,
): Promise<WritingReview> => {
  const answered = tasks.filter(
    (task) => countWords(answers[task.id] ?? "") > 0,
  );

  const assessments = answered.length
    ? (
        await askStructured<{ tasks: TaskAssessment[] }>(
          systemPrompt(locale),
          answered
            .map((task) => taskPrompt(task, answers[task.id]))
            .join("\n\n"),
          schema,
        )
      ).tasks
    : [];

  const reviews = tasks.map((task) =>
    toReview(
      task,
      answers[task.id] ?? "",
      assessments.find((item) => item.taskId === task.id),
    ),
  );
  const totalWeight =
    tasks.reduce((sum, task) => sum + task.targetWords, 0) || 1;
  const score = Math.round(
    reviews.reduce(
      (sum, review, index) => sum + review.score * tasks[index].targetWords,
      0,
    ) / totalWeight,
  );

  return { score, tasks: reviews };
};
