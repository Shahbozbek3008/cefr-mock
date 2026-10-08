import { useTranslations } from 'next-intl';
import { LEVELS, MAX_SCORE } from '@/lib/constants';
import { LATEST_RESULT, PROGRESS_HISTORY, PROGRESS_SKILLS } from '@/lib/mock/results';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { Tag } from '@/components/ui/tag';
import { LineChart } from '@/components/ui/line-chart';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AppMain, PageHeader } from '@/components/layout/page-header';
import { CountUp } from '@/components/motion/count-up';
import { Panel } from '@/components/dashboard/panel';
import { Trend } from '@/components/dashboard/trend';
import { SkillsCard } from '@/components/dashboard/skills-card';
import { Delta } from '@/components/app/delta';

export const generateMetadata = metadataTitle('progress.title');

const THRESHOLDS = LEVELS.slice(1).map((l) => ({ value: l.min, label: `${l.code} · ${l.min}` }));
const POINT_LABELS = PROGRESS_HISTORY.scores.map((_, i) => `Mock Test #${i + 4}`);
const nextLevel = LEVELS.find((l) => l.min > LATEST_RESULT.total)!;
const COLUMNS = 'grid-cols-[72px_minmax(0,1fr)_72px_64px_56px]';

function OverallChart() {
  const t = useTranslations('progress');
  return (
    <Panel className="pb-4">
      <div className="flex flex-wrap items-end justify-between gap-4 px-5 pt-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-ink-2">{t('overall')}</span>
          <div className="flex items-center gap-2.5">
            <span className="text-[44px] leading-none font-light tracking-[-0.055em]"><CountUp value={LATEST_RESULT.total} /></span>
            <span className="font-mono text-xs text-ink-3">/ {MAX_SCORE}</span>
            <Trend value={PROGRESS_HISTORY.gain} />
          </div>
        </div>
        <span className="rounded-[8px] bg-surface-muted px-2.5 py-1.5 text-xs text-ink-2">
          {t('toNext', { level: nextLevel.code, points: nextLevel.min - LATEST_RESULT.total })}
        </span>
      </div>
      <div className="px-5 pt-5">
        <LineChart data={PROGRESS_HISTORY.scores} thresholds={THRESHOLDS} label={t('chartLabel')} height={280} axisLabels={t('months').split(',')} pointLabels={POINT_LABELS} />
      </div>
    </Panel>
  );
}

function HistoryTable() {
  const t = useTranslations('progress');
  return (
    <Panel title={t('history')} subtitle={t('historySubtitle')} action={<span className="text-[13px] font-medium text-green-text">{t('all')}</span>}>
      <div className="flex flex-col px-3 pt-3 pb-2">
        <div className={`grid ${COLUMNS} gap-4 px-3 pb-2 text-[11px] font-medium text-ink-3 shadow-[0_1px_0_var(--divider)]`}>
          <span>{t('columns.date')}</span>
          <span>{t('columns.test')}</span>
          <span>{t('columns.score')}</span>
          <span>{t('columns.level')}</span>
          <span className="text-right">{t('columns.change')}</span>
        </div>
        {PROGRESS_HISTORY.attempts.map((a) => (
          <div key={a.name} className={`grid ${COLUMNS} h-12 items-center gap-4 rounded-[10px] px-3 text-[13px] transition-colors duration-(--t-fast) hover:bg-surface-muted`}>
            <span className="font-mono text-xs text-ink-3">{a.date}</span>
            <span className="truncate font-medium">{a.name}</span>
            <span className="font-mono text-xs">{a.score}<span className="text-ink-3">/{MAX_SCORE}</span></span>
            <Tag size="sm" className="justify-self-start">{a.level}</Tag>
            <Delta value={a.delta} className="text-right" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ProgressView() {
  const t = useTranslations('progress');
  return (
    <AppMain className="gap-5">
      <PageHeader
        meta={t('meta', { count: PROGRESS_HISTORY.scores.length })}
        title={t('title')}
        actions={<SegmentedControl label={t('title')} defaultValue="3m" className="h-8 w-[220px] rounded-[10px] text-xs [&>button]:rounded-[7px]" options={(['1m', '3m', 'all'] as const).map((v) => ({ value: v, label: t(`range.${v}`) }))} />}
      />
      <OverallChart />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <SkillsCard skills={PROGRESS_SKILLS} title={t('sections')} subtitle={t('sectionsSubtitle')} />
        <HistoryTable />
      </div>
    </AppMain>
  );
}

export default async function ProgressPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <ProgressView />;
}
