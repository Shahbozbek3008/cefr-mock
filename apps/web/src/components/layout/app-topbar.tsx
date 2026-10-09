'use client';

import { useTranslations } from 'next-intl';
import { ChevronRight, Menu, Plus } from 'lucide-react';
import { usePathname } from '@/i18n/navigation';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { BRAND_NAME } from '@/components/ui/logo';
import { NextTestLink } from '@/components/exam/next-test-link';
import { findActiveNav } from './app-nav';
import { NotificationsMenu } from './notifications-menu';
import { useSidebar } from './sidebar-context';

export function AppTopbar() {
  const t = useTranslations('app');
  const pathname = usePathname();
  const active = findActiveNav(pathname);
  const { setMobileOpen } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 bg-bg/80 px-4 shadow-[0_1px_0_rgba(20,22,30,.06)] backdrop-blur-xl backdrop-saturate-150 sm:px-6 lg:px-10">
      <IconButton icon={Menu} label={t('sidebar.open')} size="xs" onClick={() => setMobileOpen(true)} className="lg:hidden" />
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 text-[13px]">
        <span className="text-ink-3 max-sm:hidden">{BRAND_NAME}</span>
        {active && (
          <>
            <Icon as={ChevronRight} size={13} strokeWidth={1.6} className="text-ink-4 max-sm:hidden" />
            <span className="flex items-center gap-1.5 truncate font-medium text-ink">
              <Icon as={active.icon} size={14} strokeWidth={1.8} className="text-ink-3" />
              {t(`nav.${active.key}`)}
            </span>
          </>
        )}
      </nav>
      <NotificationsMenu label={t('topbar.notifications')} />
      <NextTestLink size="xs" icon={<Icon as={Plus} size={14} strokeWidth={2} />} className="h-8 gap-1.5 rounded-[9px] px-3 text-[13px]">
        <span className="max-sm:sr-only">{t('topbar.newTest')}</span>
      </NextTestLink>
    </header>
  );
}
