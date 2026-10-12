import { AlarmClock, CalendarDays, ChartLine, ChartNoAxesColumnIncreasing, CreditCard, FilePlus2, House, Layers, Settings, Sparkles, UserRound, type LucideIcon } from 'lucide-react';
import type { NotificationKind } from '@cefr/core';
import { ROUTES } from '@/constants/routes';
import type { NavGroup, NotificationGroup } from '@/types/layout';

export const SIDEBAR_COOKIE = 'sidebar_collapsed';

export const APP_NAV: readonly NavGroup[] = [
  {
    key: 'workspace',
    items: [
      { key: 'home', href: ROUTES.dashboard, icon: House, match: (p) => p === ROUTES.dashboard },
      { key: 'tests', href: ROUTES.catalog, icon: Layers, match: (p) => p.startsWith(ROUTES.catalog) || p.startsWith(ROUTES.results) },
      { key: 'progress', href: ROUTES.progress, icon: ChartLine, match: (p) => p.startsWith(ROUTES.progress) },
    ],
  },
  {
    key: 'account',
    items: [
      { key: 'profile', href: ROUTES.settings, icon: UserRound, match: (p) => p.startsWith(ROUTES.settings) },
      { key: 'billing', href: ROUTES.billing, icon: CreditCard, match: (p) => p.startsWith(ROUTES.billing) },
    ],
  },
];

export const NOTIFICATION_GROUPS: NotificationGroup[] = ['today', 'yesterday', 'earlier'];

export const DAY_MS = 86_400_000;

export const NOTIFICATION_BADGE_MAX = 9;

export const NOTIFICATION_SKELETON_ROWS = 3;

export const NOTIFICATION_KINDS: Record<NotificationKind, { icon: LucideIcon; tone: string }> = {
  result: { icon: ChartNoAxesColumnIncreasing, tone: 'bg-green-50 text-green-text' },
  aiReview: { icon: Sparkles, tone: 'bg-blue-50 text-blue-text' },
  reminder: { icon: AlarmClock, tone: 'bg-warning-50 text-warning-text' },
  newTest: { icon: FilePlus2, tone: 'bg-blue-50 text-blue-text' },
  exam: { icon: CalendarDays, tone: 'bg-error-50 text-error-text' },
};

export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const SIDEBAR_TOGGLE_KEY = 'b';

export const SIDEBAR_TOOLTIP_DELAY = 250;

export const USER_MENU_LINKS = [
  { key: 'settings', href: ROUTES.settings, icon: Settings },
  { key: 'billing', href: ROUTES.billing, icon: CreditCard },
] as const;
