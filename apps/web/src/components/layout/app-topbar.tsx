'use client';

import { useTranslations } from 'next-intl';
import { daysUntil, useProfile } from '@cefr/core';
import { Bell, CalendarDays, ChevronRight, Plus } from 'lucide-react';
import { usePathname } from '@/i18n/navigation';
import { Icon } from '@/components/ui/icon';
import { NextTestLink } from '@/components/exam/next-test-link';
import { findActiveNav } from './app-nav';

export function AppTopbar() {
  const t = useTranslations('app');
  const pathname = usePathname();
  const active = findActiveNav(pathname);
  const examDate = useProfile().data?.examDate;

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 bg-bg/80 px-6 shadow-[0_1px_0_rgba(20,22,30,.06)] backdrop-blur-xl backdrop-saturate-150 md:px-10">
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 text-[13px]">
        <span className="text-ink-3">CEFR Mock</span>
        {active && (
          <>
            <Icon as={ChevronRight} size={13} strokeWidth={1.6} className="text-ink-4" />
            <span className="flex items-center gap-1.5 truncate font-medium text-ink">
              <Icon as={active.icon} size={14} strokeWidth={1.8} className="text-ink-3" />
              {t(`nav.${active.key}`)}
            </span>
          </>
        )}
      </nav>
      {examDate && (
      <span className="flex h-8 items-center gap-1.5 rounded-[9px] bg-surface px-2.5 text-[12.5px] text-ink-2 shadow-[0_0_0_1px_rgba(20,22,30,.07)] max-md:hidden">
        <Icon as={CalendarDays} size={14} strokeWidth={1.6} className="text-ink-3" />
        {t('topbar.exam', { days: daysUntil(examDate) })}
      </span>
      )}
      <button
        type="button"
        aria-label={t('topbar.notifications')}
        className="relative grid size-8 place-items-center rounded-[9px] text-ink-2 transition-colors duration-(--t-fast) hover:bg-hover hover:text-ink"
      >
        <Icon as={Bell} size={16} strokeWidth={1.6} />
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-error ring-2 ring-bg" />
      </button>
      <NextTestLink size="xs" icon={<Icon as={Plus} size={14} strokeWidth={2} />} className="h-8 gap-1.5 rounded-[9px] px-3 text-[13px]">
        {t('topbar.newTest')}
      </NextTestLink>
    </header>
  );
}
