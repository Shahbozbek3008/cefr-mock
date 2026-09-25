export type SectionKind = 'listening' | 'reading' | 'writing' | 'speaking';

export type Choice = { key: string; text: string };

type QuestionBase = {
  id: string;
  number: number;
  prompt: string;
  answer: string;
  explanation?: string;
};

export type McqQuestion = QuestionBase & { kind: 'mcq'; options: Choice[] };
export type GapQuestion = QuestionBase & { kind: 'gap' };
export type TfngQuestion = QuestionBase & { kind: 'tfng' };

export type Question = McqQuestion | GapQuestion | TfngQuestion;

export type ListeningPart = {
  id: string;
  index: number;
  instruction: string;
  emphasis?: string;
  title?: string;
  durationSec: number;
  audioAt?: Record<number, number>;
  questions: Question[];
};

export type PassageParagraph = { label: string; text: string; highlight?: string };

export type ReadingPart = {
  id: string;
  index: number;
  title: string;
  instruction: string;
  passage: PassageParagraph[];
  questions: Question[];
};

export type WritingTask = {
  id: string;
  index: number;
  label: string;
  kind: string;
  prompt: string;
  targetWords: number;
  minWords: number;
};

export type SpeakingQuestion = {
  id: string;
  index: number;
  part: string;
  prompt: string;
  image?: string;
  prepSec: number;
  answerSec: number;
};

export type SectionMeta = {
  kind: SectionKind;
  title: string;
  parts: number;
  questions?: number;
  minutes: number;
  approx?: boolean;
};

export type TestFormat = { month: number; year: number };

export type TestStatus = 'new' | 'in_progress' | 'completed' | 'locked';

export type TestSummary = {
  id: string;
  number: number;
  title: string;
  format: TestFormat;
  durationLabel: string;
  isNew: boolean;
  isFree: boolean;
  isPro: boolean;
  status: TestStatus;
  progress?: number;
  resumeSection?: SectionKind;
  resumeAnswered?: number;
  resumeTotal?: number;
  resumeRemainingSec?: number;
  score?: number;
  level?: string;
  completedAt?: string;
  resultId?: string;
};

export type TestDetail = {
  id: string;
  number: number;
  title: string;
  format: TestFormat;
  durationLabel: string;
  sectionsCount: number;
  scoreRange: string;
  sections: SectionMeta[];
  listening: ListeningPart[];
  reading: ReadingPart[];
  writing: WritingTask[];
  speaking: SpeakingQuestion[];
};
