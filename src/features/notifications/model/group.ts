import type { AppNotification } from '@/entities/notification';

export type NotificationGroup = 'today' | 'yesterday' | 'earlier';

export type NotificationSection = {
  group: NotificationGroup;
  items: AppNotification[];
};

const DAY_MS = 86_400_000;
const order: NotificationGroup[] = ['today', 'yesterday', 'earlier'];

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const groupOf = (iso: string, now: Date): NotificationGroup => {
  const days = Math.round((startOfDay(now) - startOfDay(new Date(iso))) / DAY_MS);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return 'earlier';
};

export const groupNotifications = (items: AppNotification[], now = new Date()): NotificationSection[] => {
  const sorted = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return order
    .map((group) => ({ group, items: sorted.filter((item) => groupOf(item.createdAt, now) === group) }))
    .filter((section) => section.items.length > 0);
};

const pad = (value: number) => String(value).padStart(2, '0');

export const clockOf = (iso: string) => {
  const date = new Date(iso);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
