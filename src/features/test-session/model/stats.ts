import type { Question } from '@/entities/test';

export type SectionStats = {
  answered: number;
  flagged: number;
  empty: number;
  emptyNumbers: number[];
  flaggedNumbers: number[];
};

export const sectionStats = (questions: Question[], answers: Record<string, string>, flags: string[]): SectionStats => {
  const flaggedNumbers = questions.filter((q) => flags.includes(q.id)).map((q) => q.number);
  const emptyNumbers = questions
    .filter((q) => !flags.includes(q.id) && !(answers[q.id] ?? '').trim())
    .map((q) => q.number);

  return {
    answered: questions.length - flaggedNumbers.length - emptyNumbers.length,
    flagged: flaggedNumbers.length,
    empty: emptyNumbers.length,
    emptyNumbers,
    flaggedNumbers,
  };
};
