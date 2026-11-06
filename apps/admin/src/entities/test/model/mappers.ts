import type { AnswerKeys, Choice, ListeningPart, PassageParagraph, Question, ReadingPart, SpeakingQuestion, WritingTask } from '@cefr/core';
import { SECTION_MINUTES, SECTION_PREFIX } from './constants';
import { createDraft, createListeningPart, createReadingPart } from './factories';
import type {
  DraftListeningPart,
  DraftQuestion,
  DraftReadingPart,
  ScriptLine,
  StoredScript,
  StoredTest,
  TestDraft,
  TestMeta,
} from './types';

type Loose<T> = Partial<T> & Record<string, unknown>;

const optional = <K extends string, V>(key: K, value: V | undefined | null, keep = Boolean(value)) =>
  (keep ? { [key]: value } : {}) as Partial<Record<K, V>>;

const text = (value: unknown) => (typeof value === 'string' ? value : '');

const choicesOf = (value: unknown): Choice[] => (Array.isArray(value) ? (value as Choice[]) : []);

const hydrateQuestion = (raw: Loose<DraftQuestion>, keys: AnswerKeys = {}): DraftQuestion => {
  const id = text(raw.id);
  const key = keys[id];
  return {
    id,
    number: Number(raw.number),
    kind: raw.kind ?? 'mcq',
    prompt: text(raw.prompt),
    options: choicesOf(raw.options),
    answer: text(raw.answer) || (key?.answer ?? ''),
    explanation: text(raw.explanation) || (key?.explanation ?? ''),
    group: text(raw.group),
  };
};

const hydrateListeningPart = (raw: Loose<DraftListeningPart>, position: number, keys?: AnswerKeys, script?: ScriptLine[]): DraftListeningPart => ({
  ...createListeningPart(position + 1),
  ...raw,
  instruction: text(raw.instruction),
  emphasis: text(raw.emphasis),
  title: text(raw.title),
  audio: text(raw.audio),
  durationSec: Number(raw.durationSec) || 0,
  audioAt: raw.audioAt ?? {},
  choices: choicesOf(raw.choices),
  questions: (raw.questions ?? []).map((question) => hydrateQuestion(question as Loose<DraftQuestion>, keys)),
  script: script ?? (Array.isArray(raw.script) ? raw.script : []),
});

const hydrateReadingPart = (raw: Loose<DraftReadingPart>, position: number, keys?: AnswerKeys): DraftReadingPart => ({
  ...createReadingPart(position + 1),
  ...raw,
  title: text(raw.title),
  instruction: text(raw.instruction),
  passage: Array.isArray(raw.passage) ? raw.passage : [],
  choices: choicesOf(raw.choices),
  questions: (raw.questions ?? []).map((question) => hydrateQuestion(question as Loose<DraftQuestion>, keys)),
});

export const hydrateDraft = (raw: Loose<TestDraft>, keys?: AnswerKeys, scripts: StoredScript[] = []): TestDraft => {
  const base = createDraft(Number(raw.number) > 0 ? Number(raw.number) : 1);
  const scriptOf = (partId: unknown) => scripts.find((script) => script.partId === partId)?.lines;
  return {
    ...base,
    ...raw,
    listening: (raw.listening ?? []).map((part, i) =>
      hydrateListeningPart(part as Loose<DraftListeningPart>, i, keys, scripts.length ? (scriptOf(part.id) ?? []) : undefined),
    ),
    reading: (raw.reading ?? []).map((part, i) => hydrateReadingPart(part as Loose<DraftReadingPart>, i, keys)),
    writing: raw.writing ?? [],
    speaking: raw.speaking ?? [],
  };
};

type StoredContent = {
  listening?: ListeningPart[];
  reading?: ReadingPart[];
  writing?: WritingTask[];
  speaking?: SpeakingQuestion[];
};

export const fromStored = (row: StoredTest, keys: AnswerKeys, scripts: StoredScript[]): TestDraft => {
  const content = (row.content ?? {}) as StoredContent;
  return hydrateDraft(
    {
      id: row.id,
      number: row.number,
      title: row.title,
      formatMonth: row.format_month,
      formatYear: row.format_year,
      durationLabel: row.duration_label,
      isNew: row.is_new,
      isPro: row.is_pro,
      listening: (content.listening ?? []) as unknown as DraftListeningPart[],
      reading: (content.reading ?? []) as unknown as DraftReadingPart[],
      writing: content.writing ?? [],
      speaking: content.speaking ?? [],
    },
    keys,
    scripts,
  );
};

export const normalizeDraft = (draft: TestDraft): TestDraft => {
  const numbered = <P extends { questions: DraftQuestion[] }>(parts: P[], section: keyof typeof SECTION_PREFIX) =>
    parts.map((part, i) => ({
      ...part,
      id: `${SECTION_PREFIX[section]}${i + 1}`,
      index: i + 1,
      questions: part.questions.map((question) => ({ ...question, id: `${SECTION_PREFIX[section]}-${question.number}` })),
    }));

  return {
    ...draft,
    listening: numbered(draft.listening, 'listening'),
    reading: numbered(draft.reading, 'reading'),
    writing: draft.writing.map((task, i) => ({ ...task, id: `w${i + 1}`, index: i + 1 })),
    speaking: draft.speaking.map((question, i) => ({ ...question, id: `s${i + 1}`, index: i + 1 })),
  };
};

const toQuestion = (question: DraftQuestion): Question => {
  const base = { id: question.id, number: question.number, prompt: question.prompt, ...optional('group', question.group) };
  return question.kind === 'mcq' ? { ...base, kind: 'mcq', options: question.options } : { ...base, kind: question.kind };
};

const toListeningPart = (part: DraftListeningPart): ListeningPart => ({
  id: part.id,
  index: part.index,
  instruction: part.instruction,
  ...optional('emphasis', part.emphasis),
  ...optional('title', part.title),
  durationSec: part.durationSec,
  ...optional('audio', part.audio),
  ...optional('audioAt', part.audioAt, Object.keys(part.audioAt).length > 0),
  ...optional('choices', part.choices, part.choices.length > 0),
  ...optional('map', part.map),
  questions: part.questions.map(toQuestion),
});

const toParagraph = (paragraph: PassageParagraph): PassageParagraph => ({
  label: paragraph.label,
  text: paragraph.text,
  ...optional('highlight', paragraph.highlight),
});

const toReadingPart = (part: DraftReadingPart): ReadingPart => ({
  id: part.id,
  index: part.index,
  title: part.title,
  instruction: part.instruction,
  passage: part.passage.map(toParagraph),
  ...optional('choices', part.choices, part.choices.length > 0),
  questions: part.questions.map(toQuestion),
});

const toWritingTask = ({ context, weight, ...task }: WritingTask): WritingTask => ({
  ...task,
  ...optional('context', context),
  ...optional('weight', weight, weight !== undefined && !Number.isNaN(weight)),
});

const toSpeakingQuestion = ({ image, ...question }: SpeakingQuestion): SpeakingQuestion => ({ ...question, ...optional('image', image) });

const toScriptLine = (line: ScriptLine): ScriptLine => ({
  voice: line.voice,
  text: line.text,
  ...optional('question', line.question, Number.isFinite(line.question)),
  ...optional('pauseAfter', line.pauseAfter, Number.isFinite(line.pauseAfter)),
});

const questionTotal = (parts: { questions: unknown[] }[]) => parts.reduce((sum, part) => sum + part.questions.length, 0);

const speakingPartCount = (questions: SpeakingQuestion[]) => new Set(questions.map((question) => question.part.split('.')[0])).size;

export const toStored = (input: TestDraft) => {
  const draft = normalizeDraft(input);
  const questions = [...draft.listening, ...draft.reading].flatMap((part) => part.questions);

  const meta: Omit<TestMeta, 'id'> = {
    number: draft.number,
    title: draft.title,
    formatMonth: draft.formatMonth,
    formatYear: draft.formatYear,
    durationLabel: draft.durationLabel,
    isNew: draft.isNew,
    isPro: draft.isPro,
  };

  const content = {
    sections: [
      { kind: 'listening', title: 'Listening', parts: draft.listening.length, questions: questionTotal(draft.listening), minutes: SECTION_MINUTES.listening },
      { kind: 'reading', title: 'Reading', parts: draft.reading.length, questions: questionTotal(draft.reading), minutes: SECTION_MINUTES.reading },
      { kind: 'writing', title: 'Writing', parts: draft.writing.length, minutes: SECTION_MINUTES.writing },
      { kind: 'speaking', title: 'Speaking', parts: speakingPartCount(draft.speaking), minutes: SECTION_MINUTES.speaking, approx: true },
    ],
    listening: draft.listening.map(toListeningPart),
    reading: draft.reading.map(toReadingPart),
    writing: draft.writing.map(toWritingTask),
    speaking: draft.speaking.map(toSpeakingQuestion),
  };

  const keys: AnswerKeys = Object.fromEntries(
    questions.map(({ id, answer, explanation }) => [id, { answer, ...optional('explanation', explanation) }]),
  );

  const scripts: StoredScript[] = draft.listening.map((part) => ({ partId: part.id, lines: part.script.map(toScriptLine) }));

  return { id: draft.id, meta, content, keys, scripts, draft };
};
