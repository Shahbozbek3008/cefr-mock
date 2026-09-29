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

export const tfng = (
  number: number,
  prompt: string,
  answer: 'True' | 'False' | 'Not given',
  explanation?: string,
): Question => ({
  id: `r-${number}`,
  number,
  kind: 'tfng',
  prompt,
  answer,
  explanation,
});

export const writingTasks = (situation: string, informal: string, formal: string, essay: string): WritingTask[] => [
  {
    id: 'w1',
    index: 1,
    label: 'Task 1.1',
    kind: 'Informal letter',
    context: situation,
    prompt: informal,
    targetWords: 50,
    minWords: 40,
  },
  {
    id: 'w2',
    index: 2,
    label: 'Task 1.2',
    kind: 'Formal letter',
    context: situation,
    prompt: formal,
    targetWords: 135,
    minWords: 120,
  },
  { id: 'w3', index: 3, label: 'Task 2', kind: 'Essay', prompt: essay, targetWords: 200, minWords: 180 },
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

export const ask = (number: number, text: string): ScriptLine => ({
  voice: 'narrator',
  text: `Question ${number}. ${text}`,
  question: number,
  pauseAfter: 1.2,
});

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
