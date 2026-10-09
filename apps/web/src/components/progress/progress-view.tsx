'use client';

import { useState, type ReactNode } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { nextLevelGap, sectionOrder, useProgress, type AxisMark, type ProgressData, type ProgressPeriod } from '@cefr/core';
import { Link } from '@/i18n/navigation';
import { LEVELS, MAX_SCORE, ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { LineChart } from '@/components/ui/line-chart';
import { ButtonLink } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { AppMain, PageHeader } from '@/components/layout/page-header';
import { CountUp } from '@/components/motion/count-up';
import { Panel, panelSurface } from '@/components/dashboard/panel';
import { Trend } from '@/components/dashboard/trend';
import { SkillsCard, SkillsCardSkeleton } from '@/components/dashboard/skills-card';
import { Delta } from '@/components/app/delta';

const THRESHOLDS = LEVELS.slice(1).map((l) => ({ value: l.min, label: `${l.code} · ${l.min}` }));
const PERIODS = ['1m', '3m', 'all'] as const satisfies readonly ProgressPeriod[];
const COLUMNS = 'grid-cols-[minmax(0,1fr)_auto_auto_16px] sm:min-w-[440px] sm:grid-cols-[72px_minmax(0,1fr)_72px_64px_56px_16px]';
const WIDE_ONLY = 'max-sm:hidden';
const ROW = `grid ${COLUMNS} h-12 items-center gap-4 rounded-[10px] px-3 text-[13px]`;
const CHART_HEIGHT = 280;
const SKELETON_AXIS = 4;
const SKELETON_ROWS = 4;

type OverallPanelProps = { score: ReactNode; trend?: ReactNode; badge: ReactNode; children: ReactNode };

function OverallPanel({ score, trend, badge, children }: OverallPanelProps) {
  const t = useTranslations('progress');
  return (
    <Panel className="pb-4">
      <div className="flex flex-wrap items-end justify-between gap-4 px-5 pt-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-ink-2">{t('overall')}</span>
          <div className="flex items-center gap-2.5">
            {score}
            <span className="font-mono text-xs text-ink-3">/ {MAX_SCORE}</span>
            {trend}
          </div>
        </div>
        {badge}
      </div>
      <div className="px-5 pt-5">{children}</div>
    </Panel>
  );
}

function OverallChartSkeleton() {
  return (
    <OverallPanel score={<Skeleton className="h-11 w-24" />} badge={<Skeleton className="h-7 w-36 rounded-[8px]" />}>
      <div className="flex flex-col gap-2">
        <Skeleton className="rounded-2xl" style={{ height: CHART_HEIGHT }} />
        <div className="flex justify-between text-[10px]">
          {Array.from({ length: SKELETON_AXIS }, (_, i) => <SkeletonText key={i} className="w-10" />)}
        </div>
      </div>
    </OverallPanel>
  );
}

function OverallChart({ data }: { data: ProgressData }) {
  const t = useTranslations('progress');
  const tr = useTranslations('exam.result');
  const format = useFormatter();
  const gap = nextLevelGap(data.total);
  const axisLabel = (mark: AxisMark) => format.dateTime(new Date(2000, mark.month, mark.day ?? 1), mark.day ? { day: 'numeric', month: 'short' } : { month: 'long' });

  return (
    <OverallPanel
      score={<span className="text-[44px] leading-none font-light tracking-[-0.055em]"><CountUp value={data.total} /></span>}
      trend={data.delta !== 0 && <Trend value={data.delta} />}
      badge={
        <span className="rounded-[8px] bg-surface-muted px-2.5 py-1.5 text-xs text-ink-2">
          {gap ? t('toNext', { level: gap.level, points: gap.points }) : tr('topLevel')}
        </span>
      }
    >
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
    </OverallPanel>
  );
}

function HistoryPanel({ children }: { children: ReactNode }) {
  const t = useTranslations('progress');
  return (
    <Panel title={t('history')} subtitle={t('historySubtitle')}>
      <div className="flex flex-col overflow-x-auto px-3 pt-3 pb-2">
        <div className={`grid ${COLUMNS} gap-4 px-3 pb-2 text-[11px] font-medium text-ink-3 shadow-[0_1px_0_var(--divider)]`}>
          <span className={WIDE_ONLY}>{t('columns.date')}</span>
          <span>{t('columns.test')}</span>
          <span>{t('columns.score')}</span>
          <span className={WIDE_ONLY}>{t('columns.level')}</span>
          <span className="text-right">{t('columns.change')}</span>
          <span />
        </div>
        {children}
      </div>
    </Panel>
  );
}

function HistoryTableSkeleton() {
  return (
    <HistoryPanel>
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <div key={i} className={ROW}>
          <SkeletonText className={cn('w-12 text-xs', WIDE_ONLY)} />
          <SkeletonText className="w-32" />
          <SkeletonText className="w-10 text-xs" />
          <Skeleton className={cn('h-[22px] w-9 rounded-chip', WIDE_ONLY)} />
          <SkeletonText className="ml-auto w-8 text-xs" />
          <span />
        </div>
      ))}
    </HistoryPanel>
  );
}

function HistoryTable({ data }: { data: ProgressData }) {
  const history = data.history;

  return (
    <HistoryPanel>
      {history.map((item, i) => {
        const previous = history[i + 1];
        return (
          <Link
            key={item.resultId}
            href={ROUTES.result(item.resultId)}
            className={`group ${ROW} text-ink transition-colors duration-(--t-fast) hover:bg-surface-muted hover:text-ink`}
          >
            <span className={cn('font-mono text-xs text-ink-3', WIDE_ONLY)}>{item.dateLabel}</span>
            <span className="truncate font-medium">{item.title}</span>
            <span className="font-mono text-xs">{item.score}<span className="text-ink-3">/{MAX_SCORE}</span></span>
            <Tag size="sm" className={cn('justify-self-start', WIDE_ONLY)}>{item.level}</Tag>
            {previous ? <Delta value={item.score - previous.score} className="text-right" /> : <span className="text-right font-mono text-xs text-ink-4">—</span>}
            <Icon as={ChevronRight} size={14} strokeWidth={1.75} className="justify-self-end text-ink-4 transition-[translate,color] duration-(--t-base) group-hover:translate-x-0.5 group-hover:text-ink-2" />
          </Link>
        );
      })}
    </HistoryPanel>
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

function ProgressSkeleton() {
  const t = useTranslations('progress');
  return (
    <>
      <OverallChartSkeleton />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <SkillsCardSkeleton title={t('sections')} subtitle={t('sectionsSubtitle')} />
        <HistoryTableSkeleton />
      </div>
    </>
  );
}

export function ProgressView() {
  const t = useTranslations('progress');
  const [period, setPeriod] = useState<ProgressPeriod>('3m');
  const progress = useProgress(period);
  const all = useProgress('all');
  const data = progress.data;

  const meta = () => {
    if (progress.isPending) return <SkeletonText className="w-40" />;
    return data && t('meta', { count: data.testsCount, range: t(`range.${period}`) });
  };

  const body = () => {
    if (progress.isPending) return <ProgressSkeleton />;
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
        meta={meta()}
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
