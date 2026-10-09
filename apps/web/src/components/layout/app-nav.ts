import { ChartLine, CreditCard, House, Layers, UserRound, type LucideIcon } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export type NavKey = 'home' | 'tests' | 'progress' | 'profile' | 'billing';

export type NavItem = { key: NavKey; href: string; icon: LucideIcon; match: (path: string) => boolean };

export type NavGroup = { key: 'workspace' | 'account'; items: readonly NavItem[] };

export const APP_NAV: readonly NavGroup[] = [
  {
    key: 'workspace',
    items: [
      { key: 'home', href: ROUTES.dashboard, icon: House, match: (p) => p === ROUTES.dashboard },
      { key: 'tests', href: ROUTES.catalog, icon: Layers, match: (p) => p.startsWith(ROUTES.catalog) || p.startsWith('/app/results') },
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

export const findActiveNav = (path: string) => APP_NAV.flatMap((g) => g.items).find((i) => i.match(path));
