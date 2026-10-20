import { Outlet } from 'react-router';
import { AppTopbar } from '@/widgets/app-shell/ui/app-topbar';
import { MobileSidebar, Sidebar } from '@/widgets/app-shell/ui/sidebar';
import { SidebarProvider } from '@/widgets/app-shell/model/sidebar-context';
import { WebPushSync } from '@/features/web-push/ui/web-push-sync';
import { SIDEBAR_COOKIE } from '@/widgets/app-shell/model/constants';
import { readCookie } from '@/shared/lib/cookies';

export default function ShellLayout() {
  return (
    <SidebarProvider defaultCollapsed={readCookie(SIDEBAR_COOKIE) === '1'}>
      <div className="flex min-h-dvh bg-track">
        <WebPushSync />
        <Sidebar />
        <MobileSidebar />
        <div className="flex min-w-0 flex-1 flex-col lg:py-2 lg:pr-2">
          <div className="flex min-h-dvh flex-1 flex-col overflow-clip bg-bg lg:min-h-[calc(100dvh-16px)] lg:rounded-[16px] lg:shadow-[0_0_0_1px_rgb(var(--line-rgb)/.06),0_1px_3px_rgba(20,22,30,.04)]">
            <AppTopbar />
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
