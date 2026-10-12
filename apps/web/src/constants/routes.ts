import type { Skill } from '@cefr/ui/lib/constants';
import { routing } from '@cefr/ui/i18n/routing';

export const LANDING_URL = process.env.NEXT_PUBLIC_LANDING_URL ?? 'http://localhost:3001';

export const ROUTES = {
  login: '/login',
  loginVerify: '/login/verify',
  start: '/start',
  startDate: '/start/date',
  startAccount: '/start/account',
  startVerify: '/start/verify',
  dashboard: '/',
  catalog: '/tests',
  progress: '/progress',
  settings: '/settings',
  billing: '/billing',
  billingSuccess: '/billing/success',
  results: '/results',
  test: (id: string) => `/tests/${id}`,
  testSection: (id: string, section: Skill) => `/tests/${id}/${section}`,
  result: (attemptId: string) => `/results/${attemptId}`,
  review: (attemptId: string) => `/results/${attemptId}/review`,
  aiWriting: (attemptId: string) => `/results/${attemptId}/writing`,
  aiSpeaking: (attemptId: string) => `/results/${attemptId}/speaking`,
} as const;

export const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`);

export const GUEST_ONLY = /^\/(login|start)(\/|$)/;
