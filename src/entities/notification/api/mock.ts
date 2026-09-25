import type { AppNotification } from '../model/types';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

export const buildMockNotifications = (): AppNotification[] => [
  {
    id: 'n1',
    kind: 'aiReview',
    params: { task: 'Task 2' },
    createdAt: ago(12 * MINUTE),
    read: false,
    url: '/result/r11/writing',
  },
  {
    id: 'n2',
    kind: 'result',
    params: { title: 'Mock Test #11', score: 58, level: 'B2' },
    createdAt: ago(3 * HOUR),
    read: false,
    url: '/result/r11',
  },
  {
    id: 'n3',
    kind: 'reminder',
    params: { minutes: 25 },
    createdAt: ago(DAY + 2 * HOUR),
    read: true,
    url: '/home',
  },
  {
    id: 'n4',
    kind: 'newTest',
    params: { title: 'Mock Test #13' },
    createdAt: ago(3 * DAY),
    read: true,
    url: '/test/t13',
  },
  {
    id: 'n5',
    kind: 'exam',
    params: { days: 30 },
    createdAt: ago(6 * DAY),
    read: true,
  },
];
