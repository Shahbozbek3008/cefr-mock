'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildMonthGrid, dayKey, isOfficialExamDay } from '@cefr/core';
import { cn } from '@/lib/cn';
import { IconButton } from '@/components/ui/icon-button';
import { ActivePill } from '@/components/motion/active-pill';

type ExamCalendarProps = {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (iso: string) => void;
  className?: string;
};

const monthOf = (iso: string | null | undefined) => {
  const date = iso ? new Date(`${iso}T00:00:00`) : new Date();
  return { year: date.getFullYear(), month: date.getMonth() };
};

export function ExamCalendar({ value, defaultValue = null, onChange, className }: ExamCalendarProps) {
  const t = useTranslations('calendar');
  const layoutId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const selected = value === undefined ? uncontrolled : value;
  const [{ year, month }, setView] = useState(() => monthOf(selected));
  const today = dayKey(new Date());
  const current = monthOf(today);
  const atStart = year === current.year && month === current.month;

  const cells = buildMonthGrid(year, month);
  const padded = [...cells, ...Array.from({ length: (7 - (cells.length % 7)) % 7 }, () => ({ day: null, iso: null }))];
  const weekdays = t('weekdays').split(',');
  const monthName = t('months').split(',')[month];

  const shift = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setView({ year: next.getFullYear(), month: next.getMonth() });
  };

  const pick = (iso: string) => {
    setUncontrolled(iso);
    onChange?.(iso);
  };

  return (
    <div className={cn('flex flex-col gap-4 rounded-[20px] bg-surface p-5 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_24px_48px_-28px_rgba(20,22,30,.22)]', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium">{t('monthTitle', { month: monthName, year })}</span>
        <div className="flex gap-1.5">
          <IconButton icon={ChevronLeft} label={t('prev')} size="xs" iconSize={14} className="text-ink-2 disabled:opacity-30" disabled={atStart} onClick={() => shift(-1)} />
          <IconButton icon={ChevronRight} label={t('next')} size="xs" iconSize={14} className="text-ink-2" onClick={() => shift(1)} />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-ink-3">
        {weekdays.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {padded.map((cell, i) => {
          if (!cell.iso) return <span key={i} className="aspect-square" />;
          const iso = cell.iso;
          const isSelected = iso === selected;
          const official = isOfficialExamDay(iso);
          const past = iso < today;
          return (
            <button
              key={iso}
              type="button"
              aria-pressed={isSelected}
              disabled={past}
              onClick={() => pick(iso)}
              className={cn(
                'relative isolate grid aspect-square place-items-center rounded-[10px] text-[13px] tabular-nums transition-[background-color,color,scale] duration-(--t-base) ease-out-expo active:scale-95 disabled:pointer-events-none disabled:text-ink-4',
                isSelected ? 'font-medium text-white' : 'text-ink-body hover:bg-surface-sunken',
                official && !isSelected && !past && 'font-medium text-blue-text',
              )}
            >
              {isSelected && <ActivePill layoutId={layoutId} className="rounded-[10px] bg-action shadow-action-sm" />}
              {cell.day}
              {official && !past && <span className={cn('absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full', isSelected ? 'bg-white' : 'bg-blue')} />}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 pt-3 text-xs text-ink-2 shadow-[0_-1px_0_var(--track)]">
        <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-blue" />{t('official')}</span>
        <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-green" />{t('selected')}</span>
      </div>
    </div>
  );
}
