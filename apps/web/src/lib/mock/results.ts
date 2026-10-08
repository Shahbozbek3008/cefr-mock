import type { Skill } from '@/lib/constants';

export type SkillScore = { skill: Skill; score: number; delta: number; weak?: boolean };

export const LATEST_RESULT = {
  attemptId: '11',
  testName: 'Mock Test #11',
  date: '2026-09-22',
  total: 58,
  delta: 6,
  level: 'B2',
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

export const PROGRESS_SKILLS: readonly SkillScore[] = [
  { skill: 'listening', score: 61, delta: 9 },
  { skill: 'reading', score: 57, delta: 12 },
  { skill: 'speaking', score: 62, delta: 6 },
  { skill: 'writing', score: 52, delta: 3, weak: true },
];

export const PROGRESS_HISTORY = {
  scores: [44, 46, 45, 49, 50, 53, 54, 58],
  gain: 14,
  attempts: [
    { date: '22.09', name: 'Mock Test #11', score: 58, level: 'B2', delta: 6 },
    { date: '08.09', name: 'Mock Test #10', score: 52, level: 'B2', delta: 2 },
    { date: '25.08', name: 'Mock Test #9', score: 50, level: 'B1', delta: 1 },
  ],
} as const;

export const WRITING_CRITERIA = [
  { name: 'Task achievement', score: 15, max: 20 },
  { name: 'Coherence', score: 13, max: 20 },
  { name: 'Lexical resource', score: 13, max: 20 },
  { name: 'Grammar', score: 11, max: 20, tone: 'warning' },
] as const;

export const SPEAKING_CRITERIA = [
  { name: 'Fluency', score: 12, max: 15 },
  { name: 'Grammar', score: 10, max: 15, tone: 'warning' },
  { name: 'Vocabulary', score: 11, max: 15 },
  { name: 'Pronunciation', score: 13, max: 15 },
] as const;
