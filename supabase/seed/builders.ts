import type { Choice, PartScript, Question, ScriptLine, SpeakingQuestion, Voice, WritingTask } from './types';

const options = (texts: string[]): Choice[] => texts.map((text, i) => ({ key: String.fromCharCode(65 + i), text }));

export const mcq = (
  section: 'l' | 'r',
  number: number,
  prompt: string,
  choices: string[],
  answer: string,
  explanation?: string,
): Question => ({
  id: `${section}-${number}`,
  number,
  kind: 'mcq',
  prompt,
  options: options(choices),
  answer,
  explanation,
});

export const gap = (
  section: 'l' | 'r',
  number: number,
  prompt: string,
  answer: string,
  explanation?: string,
): Question => ({
  id: `${section}-${number}`,
  number,
  kind: 'gap',
  prompt,
  answer,
  explanation,
});

export const match = (section: 'l' | 'r', number: number, prompt: string, answer: string, explanation?: string): Question => ({
  id: `${section}-${number}`,
  number,
  kind: 'match',
  prompt,
  answer,
  explanation,
});

export const choices = (texts: string[]): Choice[] => options(texts);

export const letters = (count: number): Choice[] => options(Array.from({ length: count }, () => ''));

export const grouped = (group: string, questions: Question[]): Question[] =>
  questions.map((question) => ({ ...question, group }));

export const tfng = (
  number: number,
  prompt: string,
  answer: 'True' | 'False' | 'No Information',
  explanation?: string,
): Question => ({
  id: `r-${number}`,
  number,
  kind: 'tfng',
  prompt,
  answer,
  explanation,
});

export const writingPaper = (email: { context: string; prompt: string }, essay: string): WritingTask[] => [
  {
    id: 'w1',
    index: 1,
    label: 'Task 1',
    kind: 'Letter',
    context: email.context,
    prompt: email.prompt,
    targetWords: 150,
    minWords: 120,
    weight: 1,
  },
  { id: 'w2', index: 2, label: 'Task 2', kind: 'Essay', prompt: essay, targetWords: 250, minWords: 250, weight: 2 },
];

type SpeakingSet = {
  personal: [string, string, string];
  pictures: string;
  compare: [string, string, string];
  monologue: { image: string; prompt: string };
  debate: string;
};

export const speakingQuestions = ({
  personal,
  pictures,
  compare,
  monologue,
  debate,
}: SpeakingSet): SpeakingQuestion[] => [
  ...personal.map((prompt, i) => ({ id: `s${i + 1}`, index: i + 1, part: '1.1', prompt, prepSec: 5, answerSec: 30 })),
  { id: 's4', index: 4, part: '1.2', prompt: compare[0], image: pictures, prepSec: 10, answerSec: 45 },
  { id: 's5', index: 5, part: '1.2', prompt: compare[1], image: pictures, prepSec: 5, answerSec: 30 },
  { id: 's6', index: 6, part: '1.2', prompt: compare[2], image: pictures, prepSec: 5, answerSec: 30 },
  { id: 's7', index: 7, part: '2', prompt: monologue.prompt, image: monologue.image, prepSec: 60, answerSec: 120 },
  { id: 's8', index: 8, part: '3', prompt: debate, prepSec: 60, answerSec: 120 },
];

export const say = (voice: Voice, text: string, pauseAfter?: number): ScriptLine => ({ voice, text, pauseAfter });

export const intro = (text: string): ScriptLine => ({ voice: 'narrator', text, pauseAfter: 1.5 });

export const cue = (number: number, voice: Voice, text: string, pauseAfter?: number): ScriptLine => ({
  voice,
  text,
  question: number,
  pauseAfter,
});

export const speaker = (number: number, index: number): ScriptLine => ({
  voice: 'narrator',
  text: `Speaker ${index}.`,
  question: number,
  pauseAfter: 0.8,
});

export const outro = (part: string): ScriptLine => ({ voice: 'narrator', text: `That is the end of part ${part}.` });

export const script = (partId: string, lines: ScriptLine[]): PartScript => ({ partId, lines });
