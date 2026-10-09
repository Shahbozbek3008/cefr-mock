'use client';

import { useId } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { Dialog } from 'radix-ui';
import { CalendarDays, ChevronRight, PanelLeftClose, PanelLeftOpen, Sparkles, X } from 'lucide-react';
import { daysUntil, useProfile, useTests, type Profile } from '@cefr/core';
import { Link, usePathname } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { Logo, LogoMark } from '@/components/ui/logo';
import { Tag } from '@/components/ui/tag';
import { ButtonLink } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Tooltip } from '@/components/ui/tooltip';
import { ActivePill } from '@/components/motion/active-pill';
import { panelSurface } from '@/components/dashboard/panel';
import { APP_NAV, type NavItem, type NavKey } from './app-nav';
import { UserMenu } from './user-menu';
import { useSidebar } from './sidebar-context';

const DAY_MS = 86_400_000;
const ghostButton = 'grid shrink-0 place-items-center rounded-[9px] text-ink-3 transition-colors duration-(--t-fast) hover:bg-[rgba(20,22,30,.045)] hover:text-ink';
const tile = 'mx-auto grid size-10 place-items-center rounded-[10px]';

type ContentProps = { collapsed: boolean; onClose?: () => void };

const isMac = () => /Mac|iPhone|iPad/.test(navigator.userAgent);

function ShortcutHint() {
  return <kbd className="rounded-[5px] bg-white/14 px-1 font-mono text-[10px] text-white/75">{isMac() ? '⌘B' : 'Ctrl B'}</kbd>;
}

function SidebarHeader({ collapsed, onClose }: ContentProps) {
  const t = useTranslations('app.sidebar');
  const { toggle } = useSidebar();

  if (collapsed) {
    return (
      <Tooltip label={<>{t('expand')}<ShortcutHint /></>}>
        <button type="button" onClick={toggle} aria-label={t('expand')} className={cn(ghostButton, 'group relative mx-auto size-10')}>
          <span className="transition-opacity duration-(--t-fast) group-hover:opacity-0"><LogoMark /></span>
          <Icon as={PanelLeftOpen} size={17} strokeWidth={1.7} className="absolute opacity-0 transition-opacity duration-(--t-fast) group-hover:opacity-100" />
        </button>
      </Tooltip>
    );
  }

  return (
    <div className="flex h-10 items-center justify-between gap-2 pl-2">
      <Link href={ROUTES.dashboard} onClick={onClose} className="flex min-w-0 items-center transition-opacity hover:opacity-80"><Logo /></Link>
      {onClose ? (
        <button type="button" onClick={onClose} aria-label={t('close')} className={cn(ghostButton, 'size-8')}>
          <Icon as={X} size={16} strokeWidth={1.7} />
        </button>
      ) : (
        <Tooltip label={<>{t('collapse')}<ShortcutHint /></>} side="bottom">
          <button type="button" onClick={toggle} aria-label={t('collapse')} className={cn(ghostButton, 'size-8')}>
            <Icon as={PanelLeftClose} size={16} strokeWidth={1.7} />
          </button>
        </Tooltip>
      )}
    </div>
  );
}

type NavLinkProps = ContentProps & { item: NavItem; active: boolean; badge?: number; layoutId: string };

function NavLink({ item, active, badge, layoutId, collapsed, onClose }: NavLinkProps) {
  const t = useTranslations('app.nav');
  const label = t(item.key);

  return (
    <Tooltip label={label} disabled={!collapsed}>
      <Link
        href={item.href}
        onClick={onClose}
        aria-current={active ? 'page' : undefined}
        aria-label={collapsed ? label : undefined}
        className={cn(
          'group relative isolate flex h-9 items-center gap-2.5 rounded-[10px] text-[13px] transition-colors duration-(--t-fast)',
          collapsed ? 'justify-center' : 'px-2.5',
          active ? 'font-medium text-ink hover:text-ink' : 'text-ink-2 hover:bg-[rgba(20,22,30,.045)] hover:text-ink',
        )}
      >
        {active && <ActivePill layoutId={layoutId} className="rounded-[10px] bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.07),0_1px_3px_rgba(20,22,30,.06)]" />}
        <Icon as={item.icon} size={16} strokeWidth={active ? 1.9 : 1.6} className={active ? 'text-ink' : 'text-ink-3 transition-colors group-hover:text-ink-2'} />
        {!collapsed && <span className="flex-1 truncate">{label}</span>}
        {badge !== undefined && (collapsed ? (
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-green shadow-[0_0_0_2px_var(--track)]" />
        ) : (
          <span className="grid h-[18px] min-w-[18px] place-items-center rounded-[6px] bg-green-100 px-1 font-mono text-[10px] font-medium text-green-text">{badge}</span>
        ))}
      </Link>
    </Tooltip>
  );
}

function SidebarNav({ collapsed, onClose }: ContentProps) {
  const t = useTranslations('app.nav');
  const pathname = usePathname();
  const layoutId = useId();
  const inProgress = useTests().data?.filter((test) => test.status === 'in_progress').length ?? 0;
  const badges: Partial<Record<NavKey, number>> = { tests: inProgress || undefined };

  return (
    <nav aria-label={t('label')} className="-mx-3 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3">
      {APP_NAV.map((group, i) => (
        <div key={group.key} className="flex flex-col gap-0.5">
          {collapsed ? (
            i > 0 && <span aria-hidden className="mx-auto mb-2 h-px w-6 bg-divider-page" />
          ) : (
            <span className="px-2.5 pb-1 text-[11px] font-medium text-ink-3">{t(group.key)}</span>
          )}
          {group.items.map((item) => (
            <NavLink key={item.key} item={item} active={item.match(pathname)} badge={badges[item.key]} layoutId={layoutId} collapsed={collapsed} onClose={onClose} />
          ))}
        </div>
      ))}
    </nav>
  );
}

const examProgress = (profile: Profile, examDate: string, days: number) => {
  const span = Math.max(1, Math.round((new Date(examDate).getTime() - new Date(profile.createdAt).getTime()) / DAY_MS));
  return { value: Math.min(span, Math.max(0, span - days)), max: span };
};

function ExamCard({ collapsed, onClose }: ContentProps) {
  const t = useTranslations('app.exam');
  const format = useFormatter();
  const profile = useProfile().data;
  if (!profile) return null;

  const examDate = profile.examDate;
  if (!examDate) {
    return (
      <Tooltip label={t('pick')} disabled={!collapsed}>
        <Link
          href={ROUTES.settings}
          onClick={onClose}
          aria-label={collapsed ? t('pick') : undefined}
          className={cn(
            'group flex items-center text-[13px] text-ink-2 transition-colors duration-(--t-fast) hover:text-ink',
            collapsed ? cn(tile, 'bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.07)]') : 'gap-2.5 rounded-[12px] border border-dashed border-line-strong px-3 py-2.5 hover:bg-[rgba(20,22,30,.03)]',
          )}
        >
          <Icon as={CalendarDays} size={15} strokeWidth={1.7} className="shrink-0 text-ink-3" />
          {!collapsed && (
            <>
              <span className="flex-1">{t('pick')}</span>
              <Icon as={ChevronRight} size={14} strokeWidth={1.75} className="text-ink-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Link>
      </Tooltip>
    );
  }

  const days = daysUntil(examDate);
  const progress = examProgress(profile, examDate, days);

  if (collapsed) {
    return (
      <Tooltip label={t('left', { days })}>
        <Link href={ROUTES.settings} aria-label={t('left', { days })} className={cn(tile, 'bg-surface font-mono text-[13px] font-medium text-ink shadow-[0_0_0_1px_rgba(20,22,30,.07),0_1px_2px_rgba(20,22,30,.04)] hover:text-ink')}>
          {days}
        </Link>
      </Tooltip>
    );
  }

  return (
    <Link href={ROUTES.settings} onClick={onClose} className={cn(panelSurface, 'flex flex-col gap-3 rounded-[14px] p-3.5 text-ink transition-shadow duration-(--t-base) hover:text-ink hover:shadow-e1')}>
      <span className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs text-ink-2">
          <Icon as={CalendarDays} size={13} strokeWidth={1.8} className="text-ink-3" />
          {t('title')}
        </span>
        {profile.targetLevel && <Tag size="sm">{profile.targetLevel}</Tag>}
      </span>
      <span className="flex items-baseline justify-between gap-2">
        <span className="flex items-baseline gap-1.5">
          <span className="text-[28px] leading-none font-light tracking-[-0.05em]">{days}</span>
          <span className="text-xs text-ink-3">{t('days', { count: days })}</span>
        </span>
        <span className="font-mono text-[11px] text-ink-3">{format.dateTime(new Date(`${examDate}T00:00:00`), { day: 'numeric', month: 'short' })}</span>
      </span>
      <ProgressBar value={progress.value} max={progress.max} tone="green" size="xs" />
    </Link>
  );
}

function UpgradeCard({ collapsed, onClose }: ContentProps) {
  const t = useTranslations('app.upsell');

  if (collapsed) {
    return (
      <Tooltip label={t('title')}>
        <Link href={ROUTES.billing} aria-label={t('title')} className={cn(tile, 'bg-hero text-white shadow-[inset_0_1px_0_rgba(255,255,255,.16)] hover:text-white')}>
          <Icon as={Sparkles} size={15} strokeWidth={1.9} />
        </Link>
      </Tooltip>
    );
  }

  return (
    <div className="relative isolate flex flex-col gap-3 overflow-hidden rounded-[14px] bg-hero p-3.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_16px_32px_-20px_oklch(0.4_0.095_263/.8)]">
      <span aria-hidden className="pointer-events-none absolute -top-14 -right-14 -z-10 size-36 animate-aurora rounded-full bg-[oklch(0.7_0.14_200/.5)] blur-[48px]" />
      <span className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-[7px] bg-white/14">
          <Icon as={Sparkles} size={12} strokeWidth={2} />
        </span>
        <span className="text-[13px] font-medium">{t('title')}</span>
      </span>
      <span className="text-xs leading-normal text-white/75">{t('text')}</span>
      <ButtonLink href={ROUTES.billing} onClick={onClose} variant="onDark" size="xs" className="h-8 rounded-[9px] text-[12.5px]">
        {t('cta')}
      </ButtonLink>
    </div>
  );
}

function SidebarContent({ collapsed, onClose }: ContentProps) {
  const profile = useProfile().data;
  return (
    <div className="flex h-full flex-col gap-5 px-3 pt-3 pb-3">
      <SidebarHeader collapsed={collapsed} onClose={onClose} />
      <SidebarNav collapsed={collapsed} onClose={onClose} />
      <div className="flex shrink-0 flex-col gap-3">
        <ExamCard collapsed={collapsed} onClose={onClose} />
        {profile && !profile.isPro && <UpgradeCard collapsed={collapsed} onClose={onClose} />}
        <UserMenu collapsed={collapsed} />
      </div>
    </div>
  );
}

export function Sidebar() {
  const { collapsed } = useSidebar();
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 overflow-hidden transition-[width] duration-(--t-sheet) ease-out-expo lg:block',
        collapsed ? 'w-(--sidebar-w-collapsed)' : 'w-(--sidebar-w)',
      )}
    >
      <SidebarContent collapsed={collapsed} />
    </aside>
  );
}

export function MobileSidebar() {
  const t = useTranslations('app.nav');
  const { mobileOpen, setMobileOpen } = useSidebar();
  const close = () => setMobileOpen(false);

  return (
    <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-(--backdrop) backdrop-blur-[3px] data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 w-(--sidebar-w) bg-track shadow-e3 outline-none data-[state=closed]:animate-drawer-out data-[state=open]:animate-drawer-in lg:hidden"
        >
          <Dialog.Title className="sr-only">{t('label')}</Dialog.Title>
          <SidebarContent collapsed={false} onClose={close} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
