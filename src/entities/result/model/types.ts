import type { SectionKind } from '@/entities/test';

export type SectionScore = {
  kind: SectionKind;
  title: string;
  score: number;
  delta: number;
  focus?: boolean;
};

export type TestResult = {
  id: string;
  testId: string;
  title: string;
  dateLabel: string;
  durationLabel: string;
  total: number;
  delta: number;
  sections: SectionScore[];
  recommendation: { title: string; detail: string };
  answers: Record<string, string>;
};

export type ReviewStatus = 'correct' | 'wrong' | 'empty';

export type AnswerReview = {
  questionId: string;
  number: number;
  status: ReviewStatus;
  prompt: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation?: string;
  audioAt?: number;
};

export type SectionReview = {
  correct: number;
  wrong: number;
  empty: number;
  items: AnswerReview[];
};

export type TextSegment = { text: string; mark?: 'grammar' | 'lexis' | 'filler' | 'good' };

export type Criterion = { label: string; score: number; max: number };

export type Correction = { from: string; to: string; note: string };

export type WritingReview = {
  taskLabel: string;
  words: number;
  score: number;
  level: string;
  levelNote: string;
  summary: string;
  criteria: Criterion[];
  segments: TextSegment[];
  corrections: Correction[];
  improved: string;
};

export type SpeakingReview = {
  part: string;
  durationSec: number;
  criteria: Criterion[];
  segments: TextSegment[];
  words: number;
  wpm: number;
  tips: { tone: 'good' | 'warn'; text: string }[];
  waveform: number[];
};

export type ProgressPeriod = '1m' | '3m' | 'all';

export type HistoryItem = {
  resultId: string;
  dateLabel: string;
  title: string;
  score: number;
  level: string;
};

export type ProgressData = {
  total: number;
  delta: number;
  testsCount: number;
  values: number[];
  axis: string[];
  sections: { title: string; score: number; delta: number; weak?: boolean }[];
  history: HistoryItem[];
};
