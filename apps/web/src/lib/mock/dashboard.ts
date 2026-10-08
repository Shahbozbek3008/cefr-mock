export const SCORE_TREND = [38, 40, 39, 42, 41, 44, 45] as const;

export const KPI = {
  score: { value: 45, delta: 4 },
  streak: { value: 12, best: 19, week: [true, true, true, true, true, false, true] },
  time: { value: 186, goal: 210 },
  exam: { elapsed: 57, total: 90 },
} as const;

export const WEEKLY_ACTIVITY: readonly number[] = [32, 45, 28, 50, 38, 0, 24];

export const TODAY_INDEX = 6;

export const DAILY_GOAL = 30;

export const TODAY_PLAN = [
  { key: 'reading', minutes: 10, done: true },
  { key: 'writing', minutes: 15, done: false },
  { key: 'vocab', minutes: 5, done: false },
] as const;

export type PlanKey = (typeof TODAY_PLAN)[number]['key'];
