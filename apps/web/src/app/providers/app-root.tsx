import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { MotionProvider } from '@cefr/ui/motion/motion-provider';
import { AppProviders } from './app-providers';

export function AppRoot() {
  return (
    <AppProviders>
      <MotionProvider>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </MotionProvider>
    </AppProviders>
  );
}

export function BlankFallback() {
  return null;
}
