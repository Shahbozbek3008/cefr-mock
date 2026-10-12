import type { SkillScore } from '@/types/demo';

export const DEMO_USER = { firstName: 'Aziza' } as const;

export const DEMO_EXAM = {
  daysLeft: 33,
  target: 'B2',
  currentScore: 45,
} as const;

export const LATEST_RESULT = {
  testName: 'Mock Test #11',
  total: 58,
  skills: [
    { skill: 'listening', score: 61, delta: 4 },
    { skill: 'reading', score: 57, delta: 6 },
    { skill: 'writing', score: 52, delta: -1, weak: true },
    { skill: 'speaking', score: 62, delta: 3 },
  ] satisfies SkillScore[],
} as const;

export const DASHBOARD_SKILLS: readonly SkillScore[] = [
  { skill: 'listening', score: 49, delta: 4 },
  { skill: 'reading', score: 46, delta: 6 },
  { skill: 'writing', score: 38, delta: -1, weak: true },
  { skill: 'speaking', score: 47, delta: 3 },
];

export const PROGRESS_SCORES = [44, 46, 45, 49, 50, 53, 54, 58] as const;

export const WRITING_CRITERIA = [
  { name: 'Task achievement', score: 15, max: 20 },
  { name: 'Coherence', score: 13, max: 20 },
  { name: 'Lexical resource', score: 13, max: 20 },
  { name: 'Grammar', score: 11, max: 20, tone: 'warning' },
] as const;
