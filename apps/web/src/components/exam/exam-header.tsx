'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { formatClock, type SectionKind } from '@cefr/core';
import { useAttemptStore } from '@/lib/attempt-store';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { TimerPill } from '@/components/test/timer-pill';
import { SectionStepper } from '@/components/test/section-stepper';
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
    <header className="grid h-(--test-header-h) shrink-0 grid-cols-[1fr_auto_1fr] items-center bg-surface px-6 shadow-[0_1px_0_rgba(20,22,30,.06)]">
      <div className="flex min-w-0 items-center gap-[14px]">
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
      <div className="flex items-center gap-2.5 justify-self-end">
        {timer}
        <Button variant="secondary" size="xs" className="rounded-[13px] px-4 text-[13px]" onClick={onFinish}>
          {t('session.finishSection')}
        </Button>
      </div>
    </header>
  );
}
