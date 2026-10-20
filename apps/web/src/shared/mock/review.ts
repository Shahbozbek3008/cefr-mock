export type AnswerStatus = 'correct' | 'wrong' | 'skipped';

const WRONG = new Set([3, 8, 13, 21, 29]);
const SKIPPED = new Set([6]);

export const LISTENING_REVIEW: readonly { n: number; status: AnswerStatus }[] = Array.from({ length: 35 }, (_, i) => {
  const n = i + 1;
  return { n, status: WRONG.has(n) ? 'wrong' : SKIPPED.has(n) ? 'skipped' : 'correct' };
});

export const REVIEW_FOCUS = {
  n: 8,
  part: 2,
  prev: 3,
  next: 13,
  audioAt: '02:14',
  prompt: 'Student fee per year: £ ______',
  answer: '45',
  correct: '35',
  transcriptBefore: '"The annual fee is forty-five pounds, ',
  transcriptMark: 'but students get ten pounds off',
  transcriptAfter: ', so that\'s…"',
} as const;
