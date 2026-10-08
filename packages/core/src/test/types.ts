export type SectionKind = 'listening' | 'reading' | 'writing' | 'speaking';

export type AttemptScope = 'full' | SectionKind;

export type Choice = { key: string; text: string };

type QuestionBase = {
  id: string;
  number: number;
  prompt: string;
  group?: string;
};

export type AnswerKey = { answer: string; explanation?: string };

export type AnswerKeys = Record<string, AnswerKey>;

export type McqQuestion = QuestionBase & { kind: 'mcq'; options: Choice[] };
export type GapQuestion = QuestionBase & { kind: 'gap' };
export type TfngQuestion = QuestionBase & { kind: 'tfng' };
export type MatchQuestion = QuestionBase & { kind: 'match' };

export type Question = McqQuestion | GapQuestion | TfngQuestion | MatchQuestion;

export type MapRoad = { points: [number, number][] };

export type MapBlock = { x: number; y: number; w: number; h: number; letter?: string; name?: string };

export type MapLabel = { x: number; y: number; text: string };

export type MapSpec = {
  width: number;
  height: number;
  roads: MapRoad[];
  blocks: MapBlock[];
  labels?: MapLabel[];
};


export type ListeningPart = {
  id: string;
  index: number;
  instruction: string;
  emphasis?: string;
  title?: string;
  durationSec: number;
  audio?: string;
  audioAt?: Record<number, number>;
  choices?: Choice[];
  map?: MapSpec;
  questions: Question[];
};

export type TranscriptLine = { voice: string; text: string; question?: number };

export type PartTranscript = { partId: string; lines: TranscriptLine[] };

export type PassageParagraph = { label: string; text: string; highlight?: string };

export type ReadingPart = {
  id: string;
  index: number;
  title: string;
  instruction: string;
  passage: PassageParagraph[];
  choices?: Choice[];
  questions: Question[];
};

export type WritingTask = {
  id: string;
  index: number;
  label: string;
  kind: string;
  context?: string;
  prompt: string;
  targetWords: number;
  minWords: number;
  weight?: number;
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
