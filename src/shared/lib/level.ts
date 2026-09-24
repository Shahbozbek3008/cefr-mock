export type Level = 'A2' | 'B1' | 'B2' | 'C1';

export const MAX_SCORE = 75;

export const levelThresholds = [
  { level: 'B1', min: 38 },
  { level: 'B2', min: 51 },
  { level: 'C1', min: 65 },
] as const;

export const levelNames: Record<Level, string> = {
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
};

export const levelFor = (score: number): Level => {
  if (score >= 65) return 'C1';
  if (score >= 51) return 'B2';
  if (score >= 38) return 'B1';
  return 'A2';
};

export const nextLevelGap = (score: number) => {
  const next = levelThresholds.find((t) => t.min > score);
  return next ? { level: next.level, points: next.min - score } : null;
};

export const toScaled = (correct: number, total: number) =>
  total === 0 ? 0 : Math.round((correct / total) * MAX_SCORE);
