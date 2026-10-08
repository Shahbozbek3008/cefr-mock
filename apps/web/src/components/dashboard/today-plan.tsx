'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { TODAY_PLAN, type PlanKey } from '@/lib/mock/dashboard';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Panel } from './panel';

export function TodayPlan() {
  const t = useTranslations('dashboard.plan');
  const [done, setDone] = useState<ReadonlySet<PlanKey>>(() => new Set(TODAY_PLAN.filter((i) => i.done).map((i) => i.key)));

  const toggle = (key: PlanKey) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <Panel title={t('title')} subtitle={t('progress', { done: done.size, total: TODAY_PLAN.length })}>
      <div className="px-5 pt-3">
        <ProgressBar value={done.size} max={TODAY_PLAN.length} tone="green" size="sm" />
      </div>
      <ul className="m-0 flex list-none flex-col gap-1 p-3">
        {TODAY_PLAN.map((item) => {
          const checked = done.has(item.key);
          return (
            <li key={item.key}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggle(item.key)}
                className="group flex w-full items-center gap-3 rounded-[10px] px-2 py-2.5 text-left transition-colors duration-(--t-fast) hover:bg-surface-muted"
              >
                <span
                  className={cn(
                    'grid size-[18px] shrink-0 place-items-center rounded-[6px] transition-[background-color,box-shadow] duration-(--t-base)',
                    checked ? 'bg-green text-white' : 'bg-surface shadow-[inset_0_0_0_1.5px_var(--border-strong)] group-hover:shadow-[inset_0_0_0_1.5px_var(--text-3)]',
                  )}
                >
                  {checked && <Icon as={Check} size={11} strokeWidth={3} className="animate-pop" />}
                </span>
                <span className={cn('flex-1 text-[13px] transition-colors duration-(--t-base)', checked ? 'text-ink-3 line-through decoration-ink-4' : 'text-ink')}>
                  {t(`items.${item.key}`)}
                </span>
                <span className="font-mono text-[11px] text-ink-3">{t('minutes', { value: item.minutes })}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
