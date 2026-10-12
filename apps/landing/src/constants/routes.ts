export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const ROUTES = {
  home: '/',
} as const;

export const APP_ROUTES = {
  login: '/login',
  start: '/start',
} as const;
