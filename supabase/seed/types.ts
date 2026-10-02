export type Choice = { key: string; text: string };

type QuestionBase = {
  id: string;
  number: number;
  prompt: string;
  answer: string;
  explanation?: string;
  group?: string;
};

export type Question =
  | (QuestionBase & { kind: 'mcq'; options: Choice[] })
  | (QuestionBase & { kind: 'gap' })
  | (QuestionBase & { kind: 'tfng' })
  | (QuestionBase & { kind: 'match' });

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
  audioAt?: Record<number, number>;
  choices?: Choice[];
  map?: MapSpec;
  questions: Question[];
};

export type ReadingPart = {
  id: string;
  index: number;
  title: string;
  instruction: string;
  passage: { label: string; text: string; highlight?: string }[];
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

export type Voice = 'narrator' | 'woman' | 'man' | 'woman2' | 'man2' | 'woman3' | 'man3';

export type ScriptLine = {
  voice: Voice;
  text: string;
  question?: number;
  pauseAfter?: number;
};

export type PartScript = { partId: string; lines: ScriptLine[] };

export type TestContent = {
  listening: ListeningPart[];
  reading: ReadingPart[];
  writing: WritingTask[];
  speaking: SpeakingQuestion[];
  scripts: PartScript[];
};
