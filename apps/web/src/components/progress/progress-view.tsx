'use client';

import { useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { nextLevelGap, sectionOrder, useProgress, type AxisMark, type ProgressData, type ProgressPeriod } from '@cefr/core';
import { Link } from '@/i18n/navigation';
import { LEVELS, MAX_SCORE, ROUTES } from '@/lib/constants';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { LineChart } from '@/components/ui/line-chart';
import { ButtonLink } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AppMain, PageHeader } from '@/components/layout/page-header';
import { CountUp } from '@/components/motion/count-up';
import { Panel, panelSurface } from '@/components/dashboard/panel';
import { Trend } from '@/components/dashboard/trend';
import { SkillsCard } from '@/components/dashboard/skills-card';
import { Delta } from '@/components/app/delta';

const THRESHOLDS = LEVELS.slice(1).map((l) => ({ value: l.min, label: `${l.code} · ${l.min}` }));
const PERIODS = ['1m', '3m', 'all'] as const satisfies readonly ProgressPeriod[];
const COLUMNS = 'grid-cols-[72px_minmax(0,1fr)_72px_64px_56px_16px]';
const CHART_HEIGHT = 280;

function OverallChart({ data }: { data: ProgressData }) {
  const t = useTranslations('progress');
  const tr = useTranslations('exam.result');
  const format = useFormatter();
  const gap = nextLevelGap(data.total);
  const axisLabel = (mark: AxisMark) => format.dateTime(new Date(2000, mark.month, mark.day ?? 1), mark.day ? { day: 'numeric', month: 'short' } : { month: 'long' });

  return (
    <Panel className="pb-4">
      <div className="flex flex-wrap items-end justify-between gap-4 px-5 pt-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-ink-2">{t('overall')}</span>
          <div className="flex items-center gap-2.5">
            <span className="text-[44px] leading-none font-light tracking-[-0.055em]"><CountUp value={data.total} /></span>
            <span className="font-mono text-xs text-ink-3">/ {MAX_SCORE}</span>
            {data.delta !== 0 && <Trend value={data.delta} />}
          </div>
        </div>
        <span className="rounded-[8px] bg-surface-muted px-2.5 py-1.5 text-xs text-ink-2">
          {gap ? t('toNext', { level: gap.level, points: gap.points }) : tr('topLevel')}
        </span>
      </div>
      <div className="px-5 pt-5">
        {data.values.length > 1 ? (
          <LineChart
            data={data.values}
            thresholds={THRESHOLDS}
            label={t('chartLabel')}
            height={CHART_HEIGHT}
            axisLabels={data.axis.map(axisLabel)}
            pointLabels={data.history.map((h) => h.title).reverse()}
          />
        ) : (
          <div className="grid place-items-center rounded-2xl bg-surface-muted px-6 text-center text-[13px] text-ink-2" style={{ height: CHART_HEIGHT }}>
            {t('emptyText')}
          </div>
        )}
      </div>
    </Panel>
  );
}

function HistoryTable({ data }: { data: ProgressData }) {
  const t = useTranslations('progress');
  const history = data.history;

  return (
    <Panel title={t('history')} subtitle={t('historySubtitle')}>
      <div className="flex flex-col overflow-x-auto px-3 pt-3 pb-2">
        <div className={`grid min-w-[440px] ${COLUMNS} gap-4 px-3 pb-2 text-[11px] font-medium text-ink-3 shadow-[0_1px_0_var(--divider)]`}>
          <span>{t('columns.date')}</span>
          <span>{t('columns.test')}</span>
          <span>{t('columns.score')}</span>
          <span>{t('columns.level')}</span>
          <span className="text-right">{t('columns.change')}</span>
          <span />
        </div>
        {history.map((item, i) => {
          const previous = history[i + 1];
          return (
            <Link
              key={item.resultId}
              href={ROUTES.result(item.resultId)}
              className={`group grid min-w-[440px] ${COLUMNS} h-12 items-center gap-4 rounded-[10px] px-3 text-[13px] text-ink transition-colors duration-(--t-fast) hover:bg-surface-muted hover:text-ink`}
            >
              <span className="font-mono text-xs text-ink-3">{item.dateLabel}</span>
              <span className="truncate font-medium">{item.title}</span>
              <span className="font-mono text-xs">{item.score}<span className="text-ink-3">/{MAX_SCORE}</span></span>
              <Tag size="sm" className="justify-self-start">{item.level}</Tag>
              {previous ? <Delta value={item.score - previous.score} className="text-right" /> : <span className="text-right font-mono text-xs text-ink-4">—</span>}
              <Icon as={ChevronRight} size={14} strokeWidth={1.75} className="justify-self-end text-ink-4 transition-[translate,color] duration-(--t-base) group-hover:translate-x-0.5 group-hover:text-ink-2" />
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}

function EmptyState({ message }: { message: string }) {
  const t = useTranslations('progress');
  return (
    <div className={`${panelSurface} flex flex-col items-center gap-2 px-6 py-16 text-center`}>
      <span className="text-[15px] font-medium">{t('empty')}</span>
      <span className="max-w-[420px] text-[13px] leading-normal text-ink-2">{message}</span>
      <ButtonLink href={ROUTES.catalog} size="md" arrow className="mt-3">{t('emptyCta')}</ButtonLink>
    </div>
  );
}

export function ProgressView() {
  const t = useTranslations('progress');
  const [period, setPeriod] = useState<ProgressPeriod>('3m');
  const progress = useProgress(period);
  const all = useProgress('all');
  const data = progress.data;

  const body = () => {
    if (progress.isPending) {
      return Array.from({ length: 2 }, (_, i) => <div key={i} className={`${panelSurface} h-72 animate-pulse`} />);
    }
    if (!data) return <EmptyState message={all.data ? t('noHistory') : t('emptyText')} />;
    return (
      <>
        <OverallChart data={data} />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <SkillsCard
            skills={data.sections.map((s, i) => ({ skill: sectionOrder[i], score: s.score, delta: s.delta, weak: s.weak }))}
            title={t('sections')}
            subtitle={t('sectionsSubtitle')}
          />
          <HistoryTable data={data} />
        </div>
      </>
    );
  };

  return (
    <AppMain className="gap-5">
      <PageHeader
        meta={data ? t('meta', { count: data.testsCount, range: t(`range.${period}`) }) : undefined}
        title={t('title')}
        actions={
          <SegmentedControl
            label={t('title')}
            value={period}
            onValueChange={(value) => setPeriod(value as ProgressPeriod)}
            className="h-8 w-[220px] rounded-[10px] text-xs [&>button]:rounded-[7px]"
            options={PERIODS.map((v) => ({ value: v, label: t(`range.${v}`) }))}
          />
        }
      />
      {body()}
    </AppMain>
  );
}
