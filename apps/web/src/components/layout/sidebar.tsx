'use client';

import { useId } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { useProfile } from '@cefr/core';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { Logo } from '@/components/ui/logo';
import { ButtonLink } from '@/components/ui/button';
import { ActivePill } from '@/components/motion/active-pill';
import { APP_NAV } from './app-nav';
import { UserMenu } from './user-menu';

function UpgradeCard() {
  const t = useTranslations('app.upsell');
  return (
    <div className="relative flex flex-col gap-3 overflow-hidden rounded-[14px] bg-surface p-3.5 shadow-[0_0_0_1px_rgba(20,22,30,.07),0_8px_20px_-14px_rgba(20,22,30,.25)]">
      <span className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full bg-[radial-gradient(closest-side,oklch(0.93_0.08_135),transparent)]" />
      <div className="relative flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-[7px] bg-action text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25)]">
          <Icon as={Sparkles} size={12} strokeWidth={2} />
        </span>
        <span className="text-[13px] font-medium">{t('title')}</span>
      </div>
      <span className="relative text-xs leading-normal text-ink-2">{t('text')}</span>
      <ButtonLink href={ROUTES.billing} size="xs" className="relative h-8 rounded-[9px] text-[12.5px]">
        {t('cta')}
      </ButtonLink>
    </div>
  );
}

export function Sidebar() {
  const t = useTranslations('app');
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const layoutId = useId();

  return (
    <aside className="sticky top-0 flex h-dvh w-(--sidebar-w) shrink-0 flex-col gap-5 px-3 pt-4 pb-3">
      <Link href={ROUTES.dashboard} className="flex h-9 items-center px-2 transition-opacity hover:opacity-80"><Logo /></Link>
      <nav className="flex flex-col gap-5" aria-label={t('nav.label')}>
        {APP_NAV.map((group) => (
          <div key={group.key} className="flex flex-col gap-px">
            <span className="px-2.5 pb-1.5 text-[11px] font-medium text-ink-3">{t(`nav.${group.key}`)}</span>
            {group.items.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative isolate flex h-8 items-center gap-2.5 rounded-[9px] px-2.5 text-[13px] transition-colors duration-(--t-fast)',
                    active ? 'font-medium text-ink hover:text-ink' : 'text-ink-2 hover:bg-[rgba(20,22,30,.045)] hover:text-ink',
                  )}
                >
                  {active && <ActivePill layoutId={layoutId} className="rounded-[9px] bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.07),0_1px_3px_rgba(20,22,30,.06)]" />}
                  <Icon as={item.icon} size={16} strokeWidth={active ? 1.9 : 1.6} className={active ? 'text-ink' : 'text-ink-3'} />
                  <span className="flex-1">{t(`nav.${item.key}`)}</span>
                  {item.badge && (
                    <span className="grid h-[18px] min-w-[18px] place-items-center rounded-[6px] bg-green-100 px-1 font-mono text-[10px] font-medium text-green-text">{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        {profile && !profile.isPro && <UpgradeCard />}
        <UserMenu />
      </div>
    </aside>
  );
}
