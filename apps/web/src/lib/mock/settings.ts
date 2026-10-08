import type { PlanId } from './plans';

export const NOTIFICATIONS = [
  { key: 'reminder', enabled: true },
  { key: 'weekly', enabled: true },
  { key: 'results', enabled: true },
  { key: 'newTests', enabled: false },
  { key: 'promo', enabled: false },
] as const;

export const CHANNELS = [
  { key: 'sms', enabled: true },
  { key: 'telegram', enabled: true },
  { key: 'email', enabled: false },
] as const;

export const PAYMENTS: readonly { date: string; plan: PlanId; amount: number }[] = [
  { date: '29.09.2026', plan: 'quarterly', amount: 119_000 },
  { date: '29.08.2026', plan: 'monthly', amount: 49_000 },
  { date: '29.07.2026', plan: 'monthly', amount: 49_000 },
];

export const SESSIONS = [
  { key: 'desktop', current: true },
  { key: 'phone', current: false },
  { key: 'tablet', current: false },
] as const;

export const REMINDER_TIME = '19:00';
