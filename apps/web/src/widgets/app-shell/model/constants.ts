import { ChartLine, CreditCard, House, Layers, Settings, UserRound } from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';
import type { NavGroup } from './types';

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

export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const SIDEBAR_TOGGLE_KEY = 'b';

export const SIDEBAR_TOOLTIP_DELAY = 250;

export const USER_MENU_LINKS = [
  { key: 'settings', href: ROUTES.settings, icon: Settings },
  { key: 'billing', href: ROUTES.billing, icon: CreditCard },
] as const;
