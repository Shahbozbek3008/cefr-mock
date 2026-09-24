import { fetchTest } from '@/entities/test';
import type { Question } from '@/entities/test';
import type {
  ProgressData,
  ProgressPeriod,
  SpeakingReview,
  TestResult,
  WritingReview,
} from '../model/types';

const wrongValue = (q: Question, override?: string) => {
  if (override) return override;
  if (q.kind === 'mcq') {
    const keys = q.options.map((o) => o.key);
    return keys[(keys.indexOf(q.answer) + 1) % keys.length];
  }
  if (q.kind === 'tfng') return q.answer === 'True' ? 'False' : 'True';
  return 'unknown';
};

const simulateAnswers = async (
  wrong: Record<number, string | undefined>,
  empty: number[],
  prefix: 'l' | 'r',
) => {
  const detail = await fetchTest('t11');
  const parts = prefix === 'l' ? detail.listening : detail.reading;
  const answers: Record<string, string> = {};
  parts.forEach((part) =>
    part.questions.forEach((q) => {
      if (empty.includes(q.number)) return;
      answers[q.id] = q.number in wrong ? wrongValue(q, wrong[q.number]) : q.answer;
    }),
  );
  return answers;
};

export const buildMockResults = async (): Promise<TestResult[]> => {
  const [listening11, reading11] = await Promise.all([
    simulateAnswers({ 3: undefined, 10: '45', 13: '15', 21: undefined, 30: 'garden' }, [6], 'l'),
    simulateAnswers({ 4: 'money', 9: undefined, 16: undefined, 23: 'True', 25: 'False', 29: undefined, 31: undefined }, [34], 'r'),
  ]);

  const [listening10, reading10] = await Promise.all([
    simulateAnswers({ 2: undefined, 3: undefined, 10: '45', 13: '15', 17: undefined, 21: undefined, 30: 'garden' }, [6, 35], 'l'),
    simulateAnswers({ 4: 'money', 9: undefined, 12: undefined, 16: undefined, 23: 'True', 25: 'False', 29: undefined, 31: undefined, 33: undefined }, [34, 35], 'r'),
  ]);

  return [
    {
      id: 'r11',
      testId: 't11',
      title: 'Mock Test #11',
      dateLabel: '22.09',
      durationLabel: '2:40:12',
      total: 58,
      delta: 4,
      sections: [
        { kind: 'listening', title: 'Listening', score: 61, delta: 3 },
        { kind: 'reading', title: 'Reading', score: 57, delta: 5 },
        { kind: 'writing', title: 'Writing', score: 52, delta: -1, focus: true },
        { kind: 'speaking', title: 'Speaking', score: 62, delta: 0 },
      ],
      recommendation: { title: 'C1 gacha 7 ball', detail: "Writing Task 2 — eng tez o'sish nuqtasi" },
      answers: { ...listening11, ...reading11 },
    },
    {
      id: 'r10',
      testId: 't10',
      title: 'Mock Test #10',
      dateLabel: '08.09',
      durationLabel: '2:44:05',
      total: 54,
      delta: 1,
      sections: [
        { kind: 'listening', title: 'Listening', score: 58, delta: 2 },
        { kind: 'reading', title: 'Reading', score: 52, delta: 3 },
        { kind: 'writing', title: 'Writing', score: 53, delta: 1, focus: true },
        { kind: 'speaking', title: 'Speaking', score: 62, delta: 1 },
      ],
      recommendation: { title: 'C1 gacha 11 ball', detail: "Reading Part 4 — eng tez o'sish nuqtasi" },
      answers: { ...listening10, ...reading10 },
    },
  ];
};

export const writingReview: WritingReview = {
  taskLabel: 'Task 2',
  words: 262,
  score: 52,
  level: 'B2',
  levelNote: "o'rta",
  summary: "Mazmun kuchli. Grammatik aniqlik va bog'lovchilarni yaxshilang.",
  criteria: [
    { label: 'Task achievement', score: 15, max: 20 },
    { label: 'Coherence', score: 13, max: 20 },
    { label: 'Lexical resource', score: 13, max: 20 },
    { label: 'Grammar', score: 11, max: 20 },
  ],
  segments: [
    { text: 'Many people ' },
    { text: 'believes', mark: 'grammar' },
    { text: ' that public transport ' },
    { text: 'is very good', mark: 'lexis' },
    { text: ' for a sustainable city. Buses ' },
    { text: 'moves', mark: 'grammar' },
    { text: ' more people…' },
  ],
  corrections: [
    { from: 'believes', to: 'believe', note: '"people" ko\'plikda — fe\'l -s olmaydi.' },
    { from: 'is very good', to: 'is essential', note: 'Kuchliroq, akademik sifat tanlang.' },
    { from: 'moves', to: 'move', note: '"Buses" ko\'plikda — fe\'l -s olmaydi.' },
  ],
  improved:
    'Many people believe that public transport is essential for a sustainable city. Buses and trains move more people using less space and producing fewer emissions than private cars.\n\nOn the other hand, some argue that roads remain vital for deliveries and emergency services, especially in growing suburbs where public transport is limited.',
};

export const speakingReview: SpeakingReview = {
  part: 'Part 1.2',
  durationSec: 58,
  criteria: [
    { label: 'Fluency', score: 12, max: 15 },
    { label: 'Grammar', score: 10, max: 15 },
    { label: 'Vocabulary', score: 11, max: 15 },
    { label: 'Pronunciation', score: 13, max: 15 },
  ],
  segments: [
    { text: 'In the picture I can see a busy market. ' },
    { text: 'Um…', mark: 'filler' },
    { text: ' People ' },
    { text: 'is buying', mark: 'grammar' },
    { text: ' fresh vegetables and they look quite happy. I think people go to places like this because it\'s ' },
    { text: 'more affordable', mark: 'good' },
    { text: ' than supermarkets…' },
  ],
  words: 112,
  wpm: 116,
  tips: [
    { tone: 'good', text: 'Fikr aniq, misollar mavzuga mos.' },
    { tone: 'warn', text: '"Um" pauzalarni kamaytiring — "Well, …" bilan boshlang.' },
  ],
  waveform: [0.4, 0.65, 0.5, 0.8, 0.35, 0.7, 0.9, 0.55, 0.45, 0.75, 0.6, 0.3, 0.85, 0.5, 0.65, 0.4, 0.7, 0.55, 0.35, 0.6, 0.45, 0.8, 0.5, 0.4, 0.65, 0.3],
};

const history = [
  { resultId: 'r11', dateLabel: '22.09', title: 'Mock Test #11', score: 58, level: 'B2' },
  { resultId: 'r10', dateLabel: '08.09', title: 'Mock Test #10', score: 54, level: 'B2' },
];

export const progressByPeriod: Record<ProgressPeriod, ProgressData> = {
  '1m': {
    total: 58,
    delta: 5,
    testsCount: 3,
    values: [53, 54, 58],
    axis: ['1-sen', '12-sen', '22-sen'],
    sections: [
      { title: 'Listening', score: 61, delta: 3 },
      { title: 'Reading', score: 57, delta: 5 },
      { title: 'Speaking', score: 62, delta: 0 },
      { title: 'Writing', score: 52, delta: -1, weak: true },
    ],
    history,
  },
  '3m': {
    total: 58,
    delta: 14,
    testsCount: 8,
    values: [44, 46, 45, 49, 50, 53, 54, 58],
    axis: ['iyul', 'avg', 'sen'],
    sections: [
      { title: 'Listening', score: 61, delta: 9 },
      { title: 'Reading', score: 57, delta: 12 },
      { title: 'Speaking', score: 62, delta: 6 },
      { title: 'Writing', score: 52, delta: 3, weak: true },
    ],
    history,
  },
  all: {
    total: 58,
    delta: 19,
    testsCount: 11,
    values: [39, 41, 44, 46, 45, 49, 50, 53, 54, 58],
    axis: ['may', 'iyul', 'sen'],
    sections: [
      { title: 'Listening', score: 61, delta: 14 },
      { title: 'Reading', score: 57, delta: 17 },
      { title: 'Speaking', score: 62, delta: 10 },
      { title: 'Writing', score: 52, delta: 8, weak: true },
    ],
    history,
  },
};
