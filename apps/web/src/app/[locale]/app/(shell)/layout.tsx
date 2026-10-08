import type { ReactNode } from 'react';
import { initLocale, type LocaleParams } from '@/lib/i18n';
import { Sidebar } from '@/components/layout/sidebar';
import { AppTopbar } from '@/components/layout/app-topbar';
import { WebPushSync } from '@/components/providers/web-push-sync';

export default async function ShellLayout({ children, params }: { children: ReactNode; params: LocaleParams }) {
  await initLocale(params);
  return (
    <div className="flex min-h-dvh bg-track">
      <WebPushSync />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col py-2 pr-2">
        <div className="flex min-h-[calc(100dvh-16px)] flex-1 flex-col overflow-clip rounded-[16px] bg-bg shadow-[0_0_0_1px_rgba(20,22,30,.06),0_1px_3px_rgba(20,22,30,.04)]">
          <AppTopbar />
          {children}
        </div>
      </div>
    </div>
  );
}
