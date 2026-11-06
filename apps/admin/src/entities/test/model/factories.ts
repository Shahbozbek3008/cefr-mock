import type { Choice, SpeakingQuestion, WritingTask } from '@cefr/core';
import {
  DEFAULT_DURATION_LABEL,
  DEFAULT_LISTENING_PARTS,
  DEFAULT_MCQ_OPTIONS,
  DEFAULT_READING_PARTS,
  SECTION_PREFIX,
} from './constants';
import type { DraftListeningPart, DraftQuestion, DraftReadingPart, QuestionKind, QuestionSection, ScriptLine, TestDraft } from './types';

export const letterAt = (index: number) => String.fromCharCode(65 + index);

export const letterChoices = (count: number): Choice[] => Array.from({ length: count }, (_, i) => ({ key: letterAt(i), text: '' }));

export const reletter = (choices: Choice[]): Choice[] => choices.map((choice, i) => ({ ...choice, key: letterAt(i) }));

export const testIdFor = (number: number) => `t${number}`;

export const defaultTitleFor = (number: number) => `Mock Test #${number}`;

export const createQuestion = (section: QuestionSection, number: number, kind: QuestionKind = 'mcq'): DraftQuestion => ({
  id: `${SECTION_PREFIX[section]}-${number}`,
  number,
  kind,
  prompt: '',
  options: kind === 'mcq' ? letterChoices(DEFAULT_MCQ_OPTIONS) : [],
  answer: '',
  explanation: '',
  group: '',
});

export const createListeningPart = (index: number): DraftListeningPart => ({
  id: `l${index}`,
  index,
  instruction: '',
  emphasis: '',
  title: '',
  durationSec: 0,
  audio: '',
  audioAt: {},
  choices: [],
  questions: [],
  script: [],
});

export const createReadingPart = (index: number): DraftReadingPart => ({
  id: `r${index}`,
  index,
  title: `Part ${index}`,
  instruction: '',
  passage: [{ label: '', text: '' }],
  choices: [],
  questions: [],
});

export const createScriptLine = (voice: ScriptLine['voice'] = 'narrator'): ScriptLine => ({ voice, text: '' });

export const createWritingTask = (index: number): WritingTask => ({
  id: `w${index}`,
  index,
  label: `Task ${index}`,
  kind: 'Essay',
  context: '',
  prompt: '',
  targetWords: 250,
  minWords: 250,
  weight: 1,
});

export const createSpeakingQuestion = (index: number, part = '1.1'): SpeakingQuestion => ({
  id: `s${index}`,
  index,
  part,
  prompt: '',
  image: '',
  prepSec: 5,
  answerSec: 30,
});

const defaultWriting = (): WritingTask[] => [
  { ...createWritingTask(1), kind: 'Letter', targetWords: 150, minWords: 120 },
  { ...createWritingTask(2), weight: 2 },
];

const defaultSpeaking = (): SpeakingQuestion[] => [
  createSpeakingQuestion(1),
  createSpeakingQuestion(2),
  createSpeakingQuestion(3),
  { ...createSpeakingQuestion(4, '1.2'), prepSec: 10, answerSec: 45 },
  createSpeakingQuestion(5, '1.2'),
  createSpeakingQuestion(6, '1.2'),
  { ...createSpeakingQuestion(7, '2'), prepSec: 60, answerSec: 120 },
  { ...createSpeakingQuestion(8, '3'), prepSec: 60, answerSec: 120 },
];

export const createDraft = (number: number, now = new Date()): TestDraft => ({
  id: testIdFor(number),
  number,
  title: defaultTitleFor(number),
  formatMonth: now.getMonth(),
  formatYear: now.getFullYear(),
  durationLabel: DEFAULT_DURATION_LABEL,
  isNew: true,
  isPro: false,
  listening: Array.from({ length: DEFAULT_LISTENING_PARTS }, (_, i) => createListeningPart(i + 1)),
  reading: Array.from({ length: DEFAULT_READING_PARTS }, (_, i) => createReadingPart(i + 1)),
  writing: defaultWriting(),
  speaking: defaultSpeaking(),
});

export const nextQuestionNumber = (parts: { questions: { number: number }[] }[]) =>
  Math.max(0, ...parts.flatMap((part) => part.questions.map((question) => question.number))) + 1;
