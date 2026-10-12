import type { ReactNode } from 'react';
import { initLocale, type LocaleParams } from '@cefr/ui/i18n/locale';
import { WebPushSync } from '@/components/providers/web-push-sync';

export default async function FocusLayout({ children, params }: { children: ReactNode; params: LocaleParams }) {
  await initLocale(params);
  return (
    <div className="min-h-dvh bg-bg-app">
      <WebPushSync />
      {children}
    </div>
  );
}
