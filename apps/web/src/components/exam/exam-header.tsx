'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCheck, X } from 'lucide-react';
import { formatClock, type SectionKind } from '@cefr/core';
import { cn } from '@/lib/cn';
import { useAttemptStore } from '@/lib/attempt-store';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { TimerPill } from '@/components/test/timer-pill';
import { SectionProgress, SectionStepper } from '@/components/test/section-stepper';
import { useSecondsLeft } from './use-seconds-left';

const WARNING_SEC = 300;

export function SectionTimer({ section, onExpire }: { section: SectionKind; onExpire: () => void }) {
  const endsAt = useAttemptStore((s) => s.endsAt[section]);
  const left = useSecondsLeft(endsAt, onExpire);
  if (!endsAt) return null;
  return <TimerPill value={formatClock(left)} warning={left <= WARNING_SEC} />;
}

type ExamHeaderProps = {
  title: string;
  subtitle?: string;
  section: SectionKind;
  timer: ReactNode;
  onExit: () => void;
  onFinish: () => void;
};

export function ExamHeader({ title, subtitle, section, timer, onExit, onFinish }: ExamHeaderProps) {
  const t = useTranslations('exam');
  return (
    <header className="relative flex h-(--test-header-h) shrink-0 items-center gap-3 bg-surface px-4 shadow-[0_1px_0_rgba(20,22,30,.06)] sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-[14px]">
        <button
          type="button"
          onClick={onExit}
          aria-label={t('session.exitA11y')}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-ink-body shadow-inset transition-[background-color,rotate] duration-(--t-sheet) ease-spring hover:rotate-90 hover:bg-bg-app hover:text-ink"
        >
          <Icon as={X} size={16} strokeWidth={1.7} />
        </button>
        <div className="flex min-w-0 flex-col leading-[1.3]">
          <span className="truncate text-sm font-medium">{title}</span>
          {subtitle && <span className="truncate text-xs text-ink-2">{subtitle}</span>}
        </div>
      </div>
      <SectionStepper current={section} />
      <div className="flex shrink-0 items-center gap-2 justify-self-end sm:gap-2.5">
        {timer}
        <Button
          variant="secondary"
          size="xs"
          aria-label={t('session.finishSection')}
          icon={<Icon as={CheckCheck} size={15} strokeWidth={1.9} />}
          className="rounded-[13px] text-[13px] max-sm:w-9 max-sm:gap-0 max-sm:px-0 sm:px-4"
          onClick={onFinish}
        >
          <span className="max-sm:sr-only">{t('session.finishSection')}</span>
        </Button>
      </div>
      <SectionProgress current={section} />
    </header>
  );
}

export const footerNavigator = 'order-first w-full min-w-0 sm:order-none sm:w-auto sm:flex-1';

export function ExamFooter({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <footer className={cn('flex shrink-0 flex-wrap items-center gap-3 bg-surface px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-1px_0_rgba(20,22,30,.06)] sm:px-6', className)}>
      {children}
    </footer>
  );
}
