import { askStructured, feedbackLanguage } from './claude.ts';
import type { Locale } from './claude.ts';
import { transcribe } from './deepgram.ts';
import type { Transcript } from './deepgram.ts';
import { MAX_SCORE, alignSegments, segmentSchema } from './segments.ts';
import type { Mark, Segment } from './segments.ts';

export type SpeakingQuestion = { id: string; part: string; prompt: string; answerSec: number };

const CRITERIA = ['Fluency', 'Grammar', 'Vocabulary', 'Pronunciation'] as const;
const CRITERION_MAX = 15;
const SECONDS_PER_MINUTE = 60;

type Tip = { tone: 'good' | 'warn'; text: string };

type Assessment = {
  criteria: { label: (typeof CRITERIA)[number]; score: number }[];
  tips: Tip[];
  answers: { questionId: string; segments: { text: string; mark: Mark | 'none' }[]; sample: string }[];
};

export type SpeakingAnswer = {
  questionId: string;
  part: string;
  prompt: string;
  path: string;
  durationSec: number;
  words: number;
  wpm: number;
  segments: Segment[];
  sample: string;
};

export type SpeakingReview = {
  score: number;
  criteria: { label: string; score: number; max: number }[];
  tips: Tip[];
  answers: SpeakingAnswer[];
};

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['criteria', 'tips', 'answers'],
  properties: {
    criteria: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'score'],
        properties: {
          label: { type: 'string', enum: [...CRITERIA] },
          score: { type: 'integer' },
        },
      },
    },
    tips: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['tone', 'text'],
        properties: {
          tone: { type: 'string', enum: ['good', 'warn'] },
          text: { type: 'string' },
        },
      },
    },
    answers: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['questionId', 'segments', 'sample'],
        properties: {
          questionId: { type: 'string' },
          segments: segmentSchema(['grammar', 'lexis', 'filler', 'good']),
          sample: { type: 'string' },
        },
      },
    },
  },
};

const systemPrompt = (
  locale: Locale,
) => `You are a senior examiner for the Uzbekistan national CEFR multilevel English exam, Speaking paper.
You receive automatic transcripts of the candidate's recorded answers with their duration and the speech recogniser's average word confidence.

Score the whole performance on four criteria, each an integer from 0 to ${CRITERION_MAX}: ${CRITERIA.join(', ')}.
Calibration per criterion: 13-15 = C1 performance, 10-12 = B2, 8-9 = B1, 4-7 = A2, 0-3 = below A2.
Judge pronunciation cautiously from recogniser confidence and transcription artefacts, and do not over-penalise it.
Unanswered or very short answers must lower Fluency and the overall assessment.

Also return:
- tips: 2 to 4 short, concrete tips written in ${feedbackLanguage[locale]}, tone "good" for strengths and "warn" for things to fix.
- answers: for every answered question, its transcript split into consecutive pieces that reproduce it exactly when joined. Mark grammar errors as "grammar", wrong or weak word choice as "lexis", hesitations such as "um" or "uh" as "filler", a few strong phrases as "good", everything else as "none". For each of these answers also write "sample": a model spoken answer to the same question in English at B2-C1 level that fits the allowed speaking time, keeps the candidate's own ideas where they are usable and sounds natural when said aloud.`;

const answerPrompt = (question: SpeakingQuestion, transcript: Transcript | undefined) =>
  transcript && transcript.text
    ? `<answer question_id="${question.id}" part="${question.part}" duration_sec="${transcript.durationSec}" confidence="${transcript.confidence.toFixed(2)}">
<question>${question.prompt}</question>
<transcript>${transcript.text}</transcript>
</answer>`
    : `<answer question_id="${question.id}" part="${question.part}" unanswered="true">
<question>${question.prompt}</question>
</answer>`;

const wordsPerMinute = (transcript: Transcript) =>
  transcript.durationSec > 0 ? Math.round((transcript.words * SECONDS_PER_MINUTE) / transcript.durationSec) : 0;

export const reviewSpeaking = async (
  questions: SpeakingQuestion[],
  recordings: Record<string, string>,
  download: (path: string) => Promise<ArrayBuffer>,
  locale: Locale,
): Promise<SpeakingReview> => {
  const recorded = questions.filter((question) => recordings[question.id]);
  const transcripts = new Map(
    await Promise.all(
      recorded.map(
        async (question) => [question.id, await transcribe(await download(recordings[question.id]))] as const,
      ),
    ),
  );
  const spoken = recorded.filter((question) => transcripts.get(question.id)?.text);

  if (spoken.length === 0) {
    return {
      score: 0,
      criteria: CRITERIA.map((label) => ({ label, score: 0, max: CRITERION_MAX })),
      tips: [],
      answers: [],
    };
  }

  const assessment = await askStructured<Assessment>(
    systemPrompt(locale),
    questions.map((question) => answerPrompt(question, transcripts.get(question.id))).join('\n\n'),
    schema,
  );

  const criteria = CRITERIA.map((label) => ({
    label,
    score: Math.max(0, Math.min(CRITERION_MAX, assessment.criteria.find((c) => c.label === label)?.score ?? 0)),
    max: CRITERION_MAX,
  }));

  const answers = spoken.map((question) => {
    const transcript = transcripts.get(question.id) as Transcript;
    const marked = assessment.answers.find((answer) => answer.questionId === question.id);
    return {
      questionId: question.id,
      part: question.part,
      prompt: question.prompt,
      path: recordings[question.id],
      durationSec: transcript.durationSec,
      words: transcript.words,
      wpm: wordsPerMinute(transcript),
      segments: marked ? alignSegments(transcript.text, marked.segments) : [{ text: transcript.text }],
      sample: marked?.sample ?? '',
    };
  });

  const score = Math.round(
    (MAX_SCORE * criteria.reduce((sum, c) => sum + c.score, 0)) / (CRITERIA.length * CRITERION_MAX),
  );

  return { score, criteria, tips: assessment.tips, answers };
};
