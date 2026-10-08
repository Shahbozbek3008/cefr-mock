import { useTranslations } from 'next-intl';
import { LEVELS, MAX_SCORE } from '@/lib/constants';
import { KPI, SCORE_TREND } from '@/lib/mock/dashboard';
import { LineChart } from '@/components/ui/line-chart';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { CountUp } from '@/components/motion/count-up';
import { Panel } from './panel';
import { Trend } from './trend';

const THRESHOLDS = LEVELS.slice(0, 2).map((l) => ({ value: l.min, label: `${l.code} · ${l.min}` }));

export function ScoreChart() {
  const t = useTranslations('dashboard.chart');
  const tp = useTranslations('progress');

  return (
    <Panel
      title={t('title')}
      subtitle={t('subtitle', { count: SCORE_TREND.length })}
      action={
        <SegmentedControl
          label={t('title')}
          defaultValue="3m"
          className="h-8 w-[200px] rounded-[10px] text-xs [&>button]:rounded-[7px]"
          options={(['1m', '3m', 'all'] as const).map((v) => ({ value: v, label: tp(`range.${v}`) }))}
        />
      }
    >
      <div className="flex items-baseline gap-2.5 px-5 pt-4">
        <span className="text-[40px] leading-none font-light tracking-[-0.055em]"><CountUp value={KPI.score.value} /></span>
        <span className="font-mono text-xs text-ink-3">/ {MAX_SCORE}</span>
        <Trend value={KPI.score.delta} />
      </div>
      <div className="px-5 pt-4 pb-5">
        <LineChart data={SCORE_TREND} thresholds={THRESHOLDS} label={tp('chartLabel')} height={260} pointLabels={SCORE_TREND.map((_, i) => `Mock Test #${i + 5}`)} />
      </div>
    </Panel>
  );
}
