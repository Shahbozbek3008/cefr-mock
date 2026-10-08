'use client';

import { useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { Popover } from 'radix-ui';
import { AlarmClock, Bell, BellOff, CalendarDays, ChartNoAxesColumnIncreasing, CheckCheck, FilePlus2, Sparkles, Trash2, type LucideIcon } from 'lucide-react';
import {
  useClearNotifications,
  useMarkAllRead,
  useMarkRead,
  useNotifications,
  useUnreadCount,
  type AppNotification,
  type NotificationKind,
} from '@cefr/core';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';

type Group = 'today' | 'yesterday' | 'earlier';

const GROUPS: Group[] = ['today', 'yesterday', 'earlier'];
const DAY_MS = 86_400_000;
const BADGE_MAX = 9;

const KINDS: Record<NotificationKind, { icon: LucideIcon; tone: string }> = {
  result: { icon: ChartNoAxesColumnIncreasing, tone: 'bg-green-50 text-green-text' },
  aiReview: { icon: Sparkles, tone: 'bg-blue-50 text-blue-text' },
  reminder: { icon: AlarmClock, tone: 'bg-warning-50 text-warning-text' },
  newTest: { icon: FilePlus2, tone: 'bg-blue-50 text-blue-text' },
  exam: { icon: CalendarDays, tone: 'bg-error-50 text-error-text' },
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const groupOf = (iso: string, now: Date): Group => {
  const days = Math.round((startOfDay(now) - startOfDay(new Date(iso))) / DAY_MS);
  if (days <= 0) return 'today';
  return days === 1 ? 'yesterday' : 'earlier';
};

const webPathOf = (url?: string) => {
  if (url?.startsWith('/result/')) return url.replace('/result/', '/app/results/');
  if (url?.startsWith('/test/')) return url.replace('/test/', '/app/tests/');
  return null;
};

const toolButton = 'grid size-7 place-items-center rounded-[8px] text-ink-3 transition-colors duration-(--t-fast) hover:bg-hover hover:text-ink disabled:pointer-events-none disabled:opacity-40';

function NotificationRow({ item, now, onOpen }: { item: AppNotification; now: Date; onOpen: (item: AppNotification) => void }) {
  const t = useTranslations('exam.notifications.kinds');
  const format = useFormatter();
  const kind = KINDS[item.kind];
  const created = new Date(item.createdAt);
  const time = groupOf(item.createdAt, now) === 'earlier' ? format.dateTime(created, { day: 'numeric', month: 'short' }) : format.dateTime(created, { hour: '2-digit', minute: '2-digit' });

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group flex w-full items-start gap-3 rounded-[12px] px-2.5 py-2.5 text-left transition-colors duration-(--t-fast) hover:bg-surface-muted"
    >
      <span className={cn('mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px]', kind.tone)}>
        <Icon as={kind.icon} size={16} strokeWidth={1.7} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-baseline gap-2">
          <span className={cn('flex-1 truncate text-[13px]', item.read ? 'text-ink-body' : 'font-medium text-ink')}>{t(`${item.kind}.title`, item.params)}</span>
          <span className="shrink-0 font-mono text-[10.5px] text-ink-3">{time}</span>
        </span>
        <span className="flex items-start gap-2">
          <span className="line-clamp-2 flex-1 text-xs leading-normal text-ink-2">{t(`${item.kind}.body`, item.params)}</span>
          <span className={cn('mt-1.5 size-1.5 shrink-0 rounded-full transition-colors', item.read ? 'bg-transparent' : 'bg-blue')} />
        </span>
      </span>
    </button>
  );
}

function PanelBody({ onNavigate }: { onNavigate: () => void }) {
  const t = useTranslations('exam.notifications');
  const tc = useTranslations('exam.common');
  const router = useRouter();
  const notifications = useNotifications();
  const unread = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const clear = useClearNotifications();
  const [now] = useState(() => new Date());
  const items = notifications.data ?? [];

  const open = (item: AppNotification) => {
    if (!item.read) markRead.mutate(item.id);
    const path = webPathOf(item.url);
    if (!path) return;
    onNavigate();
    router.push(path);
  };

  const list = () => {
    if (notifications.isPending) {
      return (
        <div className="flex flex-col gap-1 p-2">
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="h-14 animate-pulse rounded-[12px] bg-surface-muted" />)}
        </div>
      );
    }
    if (notifications.isError) {
      return (
        <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <span className="text-[13px] text-ink-2">{t('loadFailed')}</span>
          <button type="button" onClick={() => notifications.refetch()} className="text-[13px] font-medium text-green-text hover:text-green-hover">{tc('retry')}</button>
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center gap-2 px-8 py-10 text-center">
          <span className="grid size-11 place-items-center rounded-2xl bg-surface-sunken text-ink-3"><Icon as={BellOff} size={18} strokeWidth={1.7} /></span>
          <span className="pt-1 text-sm font-medium">{t('emptyTitle')}</span>
          <span className="text-xs leading-normal text-ink-2">{t('emptyMessage')}</span>
        </div>
      );
    }
    return GROUPS.map((group) => {
      const section = items.filter((item) => groupOf(item.createdAt, now) === group);
      if (section.length === 0) return null;
      return (
        <div key={group} className="flex flex-col px-1.5 pb-1">
          <span className="px-2.5 pt-2.5 pb-1 text-[11px] font-medium text-ink-3">{t(group)}</span>
          {section.map((item) => <NotificationRow key={item.id} item={item} now={now} onOpen={open} />)}
        </div>
      );
    });
  };

  return (
    <>
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-3 shadow-[0_1px_0_var(--divider)]">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-medium">{t('title')}</span>
          <span className="text-[11px] text-ink-3">{unread > 0 ? t('unread', { count: unread }) : ' '}</span>
        </div>
        <button type="button" aria-label={t('markAllRead')} title={t('markAllRead')} disabled={unread === 0} onClick={() => markAllRead.mutate(undefined)} className={toolButton}>
          <Icon as={CheckCheck} size={15} strokeWidth={1.7} />
        </button>
        <button type="button" aria-label={t('clear')} title={t('clear')} disabled={items.length === 0} onClick={() => clear.mutate(undefined)} className={toolButton}>
          <Icon as={Trash2} size={14} strokeWidth={1.7} />
        </button>
      </div>
      <div className="max-h-[min(440px,calc(100dvh-140px))] overflow-y-auto overscroll-contain py-1">{list()}</div>
    </>
  );
}

export function NotificationsMenu({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const notifications = useNotifications();
  const unread = useUnreadCount();

  const toggle = (next: boolean) => {
    setOpen(next);
    if (next) notifications.refetch();
  };

  return (
    <Popover.Root open={open} onOpenChange={toggle}>
      <Popover.Trigger
        aria-label={label}
        className="relative grid size-8 place-items-center rounded-[9px] text-ink-2 transition-colors duration-(--t-fast) outline-none hover:bg-hover hover:text-ink focus-visible:shadow-focus data-[state=open]:bg-hover data-[state=open]:text-ink"
      >
        <Icon as={Bell} size={16} strokeWidth={1.6} className={cn(unread > 0 && 'origin-top animate-bell')} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 animate-pop place-items-center rounded-full bg-error px-1 font-mono text-[9.5px] leading-none font-medium text-white ring-2 ring-bg">
            {unread > BADGE_MAX ? `${BADGE_MAX}+` : unread}
          </span>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-50 flex w-[min(380px,calc(100vw-24px))] origin-(--radix-popover-content-transform-origin) flex-col overflow-hidden rounded-[16px] bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.08),0_24px_48px_-20px_rgba(20,22,30,.3)] outline-none data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in"
        >
          <PanelBody onNavigate={() => setOpen(false)} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
