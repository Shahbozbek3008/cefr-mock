export type Choice = { key: string; text: string };

type QuestionBase = {
  id: string;
  number: number;
  prompt: string;
  answer: string;
  explanation?: string;
};

export type Question =
  | (QuestionBase & { kind: 'mcq'; options: Choice[] })
  | (QuestionBase & { kind: 'gap' })
  | (QuestionBase & { kind: 'tfng' });

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

export type ReadingPart = {
  id: string;
  index: number;
  title: string;
  instruction: string;
  passage: { label: string; text: string; highlight?: string }[];
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
