'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useProgress, type ProgressPeriod } from '@cefr/core';
import { LEVELS, MAX_SCORE } from '@/lib/constants';
import { LineChart } from '@/components/ui/line-chart';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { CountUp } from '@/components/motion/count-up';
import { Panel } from './panel';
import { Trend } from './trend';

const THRESHOLDS = LEVELS.slice(0, 2).map((l) => ({ value: l.min, label: `${l.code} · ${l.min}` }));
const PERIODS = ['1m', '3m', 'all'] as const satisfies readonly ProgressPeriod[];
const HEIGHT = 260;

export function ScoreChart() {
  const t = useTranslations('dashboard.chart');
  const tp = useTranslations('progress');
  const [period, setPeriod] = useState<ProgressPeriod>('3m');
  const progress = useProgress(period);
  const data = progress.data;

  return (
    <Panel
      title={t('title')}
      subtitle={data ? t('subtitle', { count: data.testsCount }) : undefined}
      action={
        <SegmentedControl
          label={t('title')}
          value={period}
          onValueChange={(value) => setPeriod(value as ProgressPeriod)}
          className="h-8 w-[200px] rounded-[10px] text-xs [&>button]:rounded-[7px]"
          options={PERIODS.map((v) => ({ value: v, label: tp(`range.${v}`) }))}
        />
      }
    >
      {data && (
        <div className="flex items-baseline gap-2.5 px-5 pt-4">
          <span className="text-[40px] leading-none font-light tracking-[-0.055em]"><CountUp value={data.total} /></span>
          <span className="font-mono text-xs text-ink-3">/ {MAX_SCORE}</span>
          {data.delta !== 0 && <Trend value={data.delta} />}
        </div>
      )}
      <div className="px-5 pt-4 pb-5">
        {data && data.values.length > 1 ? (
          <LineChart data={data.values} thresholds={THRESHOLDS} label={tp('chartLabel')} height={HEIGHT} pointLabels={data.history.map((h) => h.title).reverse()} />
        ) : (
          <div className={`grid place-items-center rounded-2xl bg-surface-muted px-6 text-center text-[13px] text-ink-2 ${progress.isPending ? 'animate-pulse' : ''}`} style={{ height: HEIGHT }}>
            {!progress.isPending && t('empty')}
          </div>
        )}
      </div>
    </Panel>
  );
}
