import type { ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { RequireAdmin } from '@/app/guards/require-admin';
import { ShellLayout } from '@/app/layouts/shell-layout';
import { AppRoot } from '@/app/providers/app-root';

type RouteModule = { default: ComponentType };

const lazyRoute = (load: () => Promise<RouteModule>) => async () => ({ Component: (await load()).default });

export const createRouter = () =>
  createBrowserRouter([
    {
      element: <AppRoot />,
      children: [
        { path: 'login', lazy: lazyRoute(() => import('@/pages/login')) },
        {
          element: <RequireAdmin />,
          children: [
            {
              element: <ShellLayout />,
              children: [
                { index: true, lazy: lazyRoute(() => import('@/pages/tests')) },
                { path: 'tests/new', lazy: lazyRoute(() => import('@/pages/new-test')) },
                { path: 'tests/:id', lazy: lazyRoute(() => import('@/pages/edit-test')) },
              ],
            },
          ],
        },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ]);
