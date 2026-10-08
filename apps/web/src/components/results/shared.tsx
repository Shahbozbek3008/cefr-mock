'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import type { Criterion, TextSegment } from '@cefr/core';
import { weakestLabel } from '@cefr/core';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { panelSurface } from '@/components/dashboard/panel';

export function ResultsTopbar({ back, title, meta, actions }: { back: string; title: string; meta?: ReactNode; actions?: ReactNode }) {
  const t = useTranslations('exam.common');
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <Link href={back} aria-label={t('back')} className="grid size-9 shrink-0 place-items-center rounded-full bg-surface text-ink-body shadow-inset hover:bg-bg-app hover:text-ink">
          <Icon as={ChevronLeft} size={16} strokeWidth={1.7} />
        </Link>
        <div className="flex min-w-0 flex-col">
          <h1 className="m-0 truncate text-[24px] leading-tight font-medium tracking-[-0.035em]">{title}</h1>
          {meta && <span className="text-[13px] text-ink-2">{meta}</span>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatePanel({ title, message, action, onAction }: { title: string; message?: string; action?: string; onAction?: () => void }) {
  return (
    <div className={cn(panelSurface, 'flex flex-col items-center gap-2 px-6 py-12 text-center')}>
      <span className="text-[15px] font-medium">{title}</span>
      {message && <span className="max-w-[420px] text-[13px] leading-normal text-ink-2">{message}</span>}
      {action && onAction && <Button size="md" className="mt-2" onClick={onAction}>{action}</Button>}
    </div>
  );
}

export function AiPendingCard() {
  const t = useTranslations('exam.aiReview');
  return (
    <div className="flex items-center gap-3 rounded-card-sm bg-blue-50 px-5 py-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-surface text-blue-text"><Icon as={Sparkles} size={16} className="animate-pulse" /></span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-blue-text">{t('checkingTitle')}</span>
        <span className="text-[13px] text-ink-2">{t('checkingMessage')}</span>
      </span>
    </div>
  );
}

export function SkeletonBlocks({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => <div key={i} className={cn(panelSurface, 'h-28 animate-pulse')} />)}
    </div>
  );
}

const MARK = {
  grammar: 'bg-error-50 underline decoration-error decoration-2 underline-offset-4',
  grammarSoft: 'bg-warning-50 underline decoration-warning decoration-2 underline-offset-4',
  lexis: 'bg-warning-50 underline decoration-warning decoration-2 underline-offset-4',
  good: 'bg-green-50 underline decoration-blue decoration-2 underline-offset-4',
  filler: 'text-ink-3',
} as const;

export function MarkedText({ segments, grammarTone = 'error', active, onMark }: {
  segments: TextSegment[];
  grammarTone?: 'error' | 'warning';
  active?: string;
  onMark?: (text: string) => void;
}) {
  return (
    <p className="m-0 text-[16px] leading-[1.85] whitespace-pre-line text-ink-reading">
      {segments.map((segment, i) => {
        if (!segment.mark) return <span key={i}>{segment.text}</span>;
        const tone = segment.mark === 'grammar' && grammarTone === 'warning' ? MARK.grammarSoft : MARK[segment.mark];
        return onMark && segment.mark !== 'filler' ? (
          <button key={i} type="button" onClick={() => onMark(segment.text)} className={cn('rounded-[3px] px-0.5 text-left', tone, active === segment.text && 'ring-2 ring-blue/40')}>
            {segment.text}
          </button>
        ) : (
          <span key={i} className={cn('rounded-[3px] px-0.5', tone)}>{segment.text}</span>
        );
      })}
    </p>
  );
}

export function CriteriaBars({ criteria }: { criteria: Criterion[] }) {
  const weakest = weakestLabel(criteria);
  return (
    <div className={cn(panelSurface, 'flex flex-col px-5 py-1')}>
      {criteria.map((c, i) => (
        <div key={c.label} className="grid h-12 grid-cols-[minmax(0,1fr)_minmax(80px,140px)_52px] items-center gap-4 text-sm shadow-[0_1px_0_var(--divider)] last:shadow-none">
          <span>{c.label}</span>
          <ProgressBar value={c.score} max={c.max} tone={c.label === weakest ? 'warning' : 'blue'} delay={i * 0.08} />
          <span className="text-right font-mono text-[13px]">{c.score}<span className="text-ink-3">/{c.max}</span></span>
        </div>
      ))}
    </div>
  );
}

export function LinkRow({ href, icon, title, detail }: { href: string; icon: ReactNode; title: string; detail?: ReactNode }) {
  return (
    <Link href={href} className={cn(panelSurface, 'group flex items-center gap-3.5 p-4 text-ink transition-[box-shadow,translate] duration-(--t-sheet) ease-out-expo hover:-translate-y-0.5 hover:text-ink hover:shadow-e1')}>
      <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-blue-50 text-blue-text">{icon}</span>
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        {detail && <span className="text-xs text-ink-2">{detail}</span>}
      </span>
      <Icon as={ArrowRight} size={16} className="text-ink-3 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
