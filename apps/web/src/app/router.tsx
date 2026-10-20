import type { ComponentType } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router';
import { defaultLocale, locales, localizePath } from '@cefr/ui/i18n/locales';
import { ROUTES } from '@/shared/config/routes';
import { LocaleRoot } from '@/app/providers/locale-root';
import { DefaultLocaleRedirect, LocalizedNavigate } from '@/shared/i18n/navigation';
import { AppRoot, BlankFallback } from '@/app/providers/app-root';
import { GuestOnly, RequireAuth } from '@/app/guards/auth-gate';

type RouteModule = { default: ComponentType };

const lazyRoute = (load: () => Promise<RouteModule>) => async () => ({ Component: (await load()).default });

const createAppRoutes = (): RouteObject[] => [
  {
    element: <GuestOnly />,
    children: [
      {
        lazy: lazyRoute(() => import('@/app/layouts/auth-layout')),
        children: [
          { path: 'login', lazy: lazyRoute(() => import('@/pages/auth/login-page')) },
          { path: 'login/verify', lazy: lazyRoute(() => import('@/pages/auth/login-verify-page')) },
          { path: 'start', lazy: lazyRoute(() => import('@/pages/auth/start-page')) },
          { path: 'start/date', lazy: lazyRoute(() => import('@/pages/auth/start-date-page')) },
          { path: 'start/account', lazy: lazyRoute(() => import('@/pages/auth/start-account-page')) },
          { path: 'start/verify', lazy: lazyRoute(() => import('@/pages/auth/start-verify-page')) },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        lazy: lazyRoute(() => import('@/app/layouts/shell-layout')),
        children: [
          { index: true, lazy: lazyRoute(() => import('@/pages/shell/dashboard-page')) },
          { path: 'tests', lazy: lazyRoute(() => import('@/pages/shell/catalog-page')) },
          { path: 'progress', lazy: lazyRoute(() => import('@/pages/shell/progress-page')) },
          { path: 'settings', lazy: lazyRoute(() => import('@/pages/shell/settings-page')) },
          { path: 'billing', lazy: lazyRoute(() => import('@/pages/shell/billing-page')) },
          { path: 'results/:attemptId', lazy: lazyRoute(() => import('@/pages/shell/result-page')) },
          { path: 'results/:attemptId/review', lazy: lazyRoute(() => import('@/pages/shell/review-page')) },
          { path: 'results/:attemptId/writing', lazy: lazyRoute(() => import('@/pages/shell/ai-writing-page')) },
          { path: 'results/:attemptId/speaking', lazy: lazyRoute(() => import('@/pages/shell/ai-speaking-page')) },
        ],
      },
      {
        lazy: lazyRoute(() => import('@/app/layouts/focus-layout')),
        children: [
          { path: 'billing/success', lazy: lazyRoute(() => import('@/pages/focus/billing-success-page')) },
          { path: 'tests/:id', lazy: lazyRoute(() => import('@/pages/focus/pretest-page')) },
          {
            path: 'tests/:id/:section',
            lazy: lazyRoute(() => import('@/app/layouts/test-section-layout')),
            children: [{ index: true, lazy: lazyRoute(() => import('@/pages/focus/test-section-page')) }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <LocalizedNavigate to={ROUTES.dashboard} /> },
];

export const createRouter = () =>
  createBrowserRouter([
    {
      element: <AppRoot />,
      HydrateFallback: BlankFallback,
      children: [
        ...locales.map((locale) => ({
          path: localizePath('/', locale),
          element: <LocaleRoot locale={locale} />,
          children: createAppRoutes(),
        })),
        { path: `/${defaultLocale}/*`, element: <DefaultLocaleRedirect /> },
      ],
    },
  ]);
