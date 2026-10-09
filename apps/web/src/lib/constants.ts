import { BookOpen, Headphones, Mic, PenLine, type LucideIcon } from 'lucide-react';

export const MAX_SCORE = 75;

export const SKILLS = ['listening', 'reading', 'writing', 'speaking'] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_ICONS: Record<Skill, LucideIcon> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic,
};

export const LEVELS = [
  { code: 'B1', min: 38, max: 50 },
  { code: 'B2', min: 51, max: 64 },
  { code: 'C1', min: 65, max: 75 },
] as const;
export type LevelCode = (typeof LEVELS)[number]['code'];

export const SCALE_SEGMENTS = [38, 13, 14, 10] as const;

export const SIDEBAR_COOKIE = 'sidebar_collapsed';

export const ROUTES = {
  home: '/',
  login: '/login',
  loginVerify: '/login/verify',
  start: '/start',
  startDate: '/start/date',
  startAccount: '/start/account',
  startVerify: '/start/verify',
  dashboard: '/app',
  catalog: '/app/tests',
  progress: '/app/progress',
  settings: '/app/settings',
  billing: '/app/billing',
  billingSuccess: '/app/billing/success',
  test: (id: string) => `/app/tests/${id}`,
  testSection: (id: string, section: Skill) => `/app/tests/${id}/${section}`,
  result: (attemptId: string) => `/app/results/${attemptId}`,
  review: (attemptId: string) => `/app/results/${attemptId}/review`,
  aiWriting: (attemptId: string) => `/app/results/${attemptId}/writing`,
  aiSpeaking: (attemptId: string) => `/app/results/${attemptId}/speaking`,
} as const;
