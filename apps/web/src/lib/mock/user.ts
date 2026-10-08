export type Plan = 'free' | 'pro';

export const MOCK_USER = {
  firstName: 'Aziza',
  lastName: 'Karimova',
  initial: 'A',
  phone: '90 123 45 67',
  memberSince: '2026-07-01',
  planByRoute: (pathname: string): Plan => (pathname === '/app' ? 'free' : 'pro'),
} as const;

export const MOCK_EXAM = {
  date: '2026-11-01',
  today: '2026-09-29',
  daysLeft: 33,
  target: 'B2',
  dailyMinutes: 30,
  mockTests: 6,
  drills: 24,
  currentScore: 45,
} as const;
