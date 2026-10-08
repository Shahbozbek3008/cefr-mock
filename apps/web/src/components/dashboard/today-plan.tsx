'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { fetchPracticeTest, sectionTitles, useCefrClient, type PlanItem } from '@cefr/core';
import { useRouter } from '@/i18n/navigation';
import { ROUTES, SKILL_ICONS } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { failureKey } from '@/lib/exam/session';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Panel } from './panel';

export function TodayPlan({ items, studied }: { items: readonly PlanItem[]; studied: number }) {
  const t = useTranslations('dashboard.plan');
  const te = useTranslations('exam');
  const client = useCefrClient();
  const router = useRouter();
  const [opening, setOpening] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const done = items.filter((item) => item.done).length;
  const goal = items.reduce((sum, item) => sum + item.minutes, 0);

  const start = async (item: PlanItem) => {
    setOpening(item.id);
    setFailure(null);
    try {
      const testId = await fetchPracticeTest(client, item.section);
      if (!testId) throw new Error('practice_unavailable');
      router.push(`${ROUTES.testSection(testId, item.section)}?scope=${item.section}`);
    } catch (error) {
      setFailure(`${te('session.startFailed')} ${te(`common.${failureKey(error)}`)}`);
      setOpening(null);
    }
  };

  return (
    <Panel title={t('title')} subtitle={t('progress', { done, total: items.length })}>
      <div className="px-5 pt-3">
        <ProgressBar value={Math.min(studied, goal)} max={goal || 1} tone="green" size="sm" />
      </div>
      <ul className="m-0 flex list-none flex-col gap-1 p-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-[10px] px-2 py-2.5">
            <span className={cn('grid size-8 shrink-0 place-items-center rounded-[9px]', item.done ? 'bg-green text-white' : 'bg-surface-sunken text-ink-2')}>
              <Icon as={item.done ? Check : SKILL_ICONS[item.section]} size={14} strokeWidth={item.done ? 3 : 1.7} className={item.done ? 'animate-pop' : undefined} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className={cn('text-[13px]', item.done ? 'text-ink-3 line-through decoration-ink-4' : 'text-ink')}>{t('item', { section: sectionTitles[item.section] })}</span>
              <span className="font-mono text-[11px] text-ink-3">{t('minutes', { value: item.minutes })}</span>
            </span>
            {item.done ? (
              <span className="text-xs font-medium text-success">{t('done')}</span>
            ) : (
              <Button size="xs" variant="secondary" disabled={opening !== null && opening !== item.id} loading={opening === item.id} onClick={() => start(item)} className="h-8 rounded-[9px] text-[13px]">
                {t('start')}
              </Button>
            )}
          </li>
        ))}
      </ul>
      {failure && <span className="px-5 pb-4 text-[13px] text-error-text">{failure}</span>}
    </Panel>
  );
}
