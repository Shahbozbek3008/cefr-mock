import type { Choice, MapSpec, PassageParagraph, SpeakingQuestion, WritingTask } from '@cefr/core';
import type { QUESTION_KINDS, VOICES } from './constants';

export type Voice = (typeof VOICES)[number];

export type QuestionKind = (typeof QUESTION_KINDS)[number];

export type ScriptLine = {
  voice: Voice;
  text: string;
  question?: number;
  pauseAfter?: number;
};

export type DraftQuestion = {
  id: string;
  number: number;
  kind: QuestionKind;
  prompt: string;
  options: Choice[];
  answer: string;
  explanation: string;
  group: string;
};

export type AudioCues = Record<number, number>;

export type DraftListeningPart = {
  id: string;
  index: number;
  instruction: string;
  emphasis: string;
  title: string;
  durationSec: number;
  audio: string;
  audioAt: AudioCues;
  choices: Choice[];
  map?: MapSpec;
  questions: DraftQuestion[];
  script: ScriptLine[];
};

export type DraftReadingPart = {
  id: string;
  index: number;
  title: string;
  instruction: string;
  passage: PassageParagraph[];
  choices: Choice[];
  questions: DraftQuestion[];
};

export type TestMeta = {
  id: string;
  number: number;
  title: string;
  formatMonth: number;
  formatYear: number;
  durationLabel: string;
  isNew: boolean;
  isPro: boolean;
};

export type TestDraft = TestMeta & {
  listening: DraftListeningPart[];
  reading: DraftReadingPart[];
  writing: WritingTask[];
  speaking: SpeakingQuestion[];
};

export type QuestionSection = 'listening' | 'reading';

export type TestRow = {
  id: string;
  number: number;
  title: string;
  format_month: number;
  format_year: number;
  duration_label: string;
  is_new: boolean;
  is_pro: boolean;
  published_at: string | null;
};

export type StoredTest = TestRow & { content: unknown };

export type StoredScript = { partId: string; lines: ScriptLine[] };

export type LoadedTest = { draft: TestDraft; published: boolean };
