import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { initLocale, type LocaleParams } from '@/lib/i18n';
import { SIDEBAR_COOKIE } from '@/lib/constants';
import { MobileSidebar, Sidebar } from '@/components/layout/sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import { AppTopbar } from '@/components/layout/app-topbar';
import { WebPushSync } from '@/components/providers/web-push-sync';

export default async function ShellLayout({ children, params }: { children: ReactNode; params: LocaleParams }) {
  await initLocale(params);
  const collapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === '1';

  return (
    <SidebarProvider defaultCollapsed={collapsed}>
      <div className="flex min-h-dvh bg-track">
        <WebPushSync />
        <Sidebar />
        <MobileSidebar />
        <div className="flex min-w-0 flex-1 flex-col lg:py-2 lg:pr-2">
          <div className="flex min-h-dvh flex-1 flex-col overflow-clip bg-bg lg:min-h-[calc(100dvh-16px)] lg:rounded-[16px] lg:shadow-[0_0_0_1px_rgba(20,22,30,.06),0_1px_3px_rgba(20,22,30,.04)]">
            <AppTopbar />
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
