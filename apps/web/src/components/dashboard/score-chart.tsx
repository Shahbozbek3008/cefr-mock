'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useProgress, type ProgressPeriod } from '@cefr/core';
import { MAX_SCORE } from '@cefr/ui/lib/constants';
import { LineChart } from '@cefr/ui/components/line-chart';
import { SegmentedControl } from '@cefr/ui/components/segmented-control';
import { Skeleton, SkeletonText } from '@cefr/ui/components/skeleton';
import { CountUp } from '@cefr/ui/motion/count-up';
import { Panel } from './panel';
import { Trend } from './trend';
import { SCORE_CHART_HEIGHT, SCORE_PERIODS, SCORE_THRESHOLDS } from '@/constants/dashboard';
const PERIOD_CONTROL = 'h-8 w-[200px] rounded-[10px]';

function ChartBodySkeleton() {
  return (
    <>
      <div className="flex items-baseline gap-2.5 px-5 pt-4">
        <Skeleton className="h-10 w-20" />
        <span className="font-mono text-xs text-ink-3">/ {MAX_SCORE}</span>
      </div>
      <div className="px-5 pt-4 pb-5">
        <Skeleton className="rounded-2xl" style={{ height: SCORE_CHART_HEIGHT }} />
      </div>
    </>
  );
}

export function ScoreChartSkeleton() {
  const t = useTranslations('dashboard.chart');
  return (
    <Panel title={t('title')} subtitle={<SkeletonText className="w-24" />} action={<Skeleton className={PERIOD_CONTROL} />}>
      <ChartBodySkeleton />
    </Panel>
  );
}

export function ScoreChart() {
  const t = useTranslations('dashboard.chart');
  const tp = useTranslations('progress');
  const [period, setPeriod] = useState<ProgressPeriod>('3m');
  const progress = useProgress(period);
  const data = progress.data;

  const subtitle = () => {
    if (progress.isPending) return <SkeletonText className="w-24" />;
    return data && t('subtitle', { count: data.testsCount });
  };

  const body = () => {
    if (progress.isPending) return <ChartBodySkeleton />;
    return (
      <>
        {data && (
          <div className="flex items-baseline gap-2.5 px-5 pt-4">
            <span className="text-[40px] leading-none font-light tracking-[-0.055em]"><CountUp value={data.total} /></span>
            <span className="font-mono text-xs text-ink-3">/ {MAX_SCORE}</span>
            {data.delta !== 0 && <Trend value={data.delta} />}
          </div>
        )}
        <div className="px-5 pt-4 pb-5">
          {data && data.values.length > 1 ? (
            <LineChart data={data.values} thresholds={SCORE_THRESHOLDS} label={tp('chartLabel')} height={SCORE_CHART_HEIGHT} pointLabels={data.history.map((h) => h.title).reverse()} />
          ) : (
            <div className="grid place-items-center rounded-2xl bg-surface-muted px-6 text-center text-[13px] text-ink-2" style={{ height: SCORE_CHART_HEIGHT }}>
              {t('empty')}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Panel
      title={t('title')}
      subtitle={subtitle()}
      action={
        <SegmentedControl
          label={t('title')}
          value={period}
          onValueChange={(value) => setPeriod(value as ProgressPeriod)}
          className={`${PERIOD_CONTROL} text-xs [&>button]:rounded-[7px]`}
          options={SCORE_PERIODS.map((v) => ({ value: v, label: tp(`range.${v}`) }))}
        />
      }
    >
      {body()}
    </Panel>
  );
}
