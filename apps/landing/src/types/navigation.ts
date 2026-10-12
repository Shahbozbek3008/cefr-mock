import type { APP_ROUTES } from '@/constants/routes';

export type NavItem = { href: string; label: string };

export type AppLinks = Record<keyof typeof APP_ROUTES, string>;
