import type { AttemptScope, SectionKind } from '../test/types';

export type Recommendation = { level: string | null; points: number; focus: string };

export type AxisMark = { month: number; day?: number };

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
  scope: AttemptScope;
  title: string;
  createdAt: string;
  dateLabel: string;
  durationLabel: string;
  total: number;
  delta: number;
  sections: SectionScore[];
  recommendation: Recommendation;
  answers: Record<string, string>;
  aiStatus: Partial<Record<AiReviewKind, AiReviewStatus>>;
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

export type AiReviewKind = 'writing' | 'speaking';

export type AiReviewStatus = 'pending' | 'processing' | 'ready' | 'failed';

export type WritingTaskReview = {
  taskId: string;
  label: string;
  words: number;
  score: number;
  level: string;
  summary: string;
  criteria: Criterion[];
  segments: TextSegment[];
  corrections: Correction[];
  improved: string;
};

export type WritingReview = {
  score: number;
  tasks: WritingTaskReview[];
};

export type SpeakingAnswer = {
  questionId: string;
  part: string;
  prompt: string;
  path: string;
  durationSec: number;
  words: number;
  wpm: number;
  segments: TextSegment[];
  sample?: string;
};

export type SpeakingReview = {
  score: number;
  criteria: Criterion[];
  tips: { tone: 'good' | 'warn'; text: string }[];
  answers: SpeakingAnswer[];
};

export type AiReview<T> = {
  status: AiReviewStatus;
  review: T | null;
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
  axis: AxisMark[];
  sections: { title: string; score: number; delta: number; weak?: boolean }[];
  history: HistoryItem[];
};
