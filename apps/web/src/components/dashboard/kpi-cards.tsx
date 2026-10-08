import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarDays, ChartNoAxesColumnIncreasing, Clock3, Flame, type LucideIcon } from 'lucide-react';
import { MAX_SCORE } from '@/lib/constants';
import { KPI, SCORE_TREND } from '@/lib/mock/dashboard';
import { MOCK_EXAM } from '@/lib/mock/user';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CountUp } from '@/components/motion/count-up';
import { Grow } from '@/components/motion/grow';
import { panelSurface } from './panel';
import { Sparkline } from './sparkline';
import { Trend } from './trend';

type KpiCardProps = { label: string; icon: LucideIcon; value: number; unit?: ReactNode; aside?: ReactNode; footer: ReactNode; accent?: boolean };

function KpiCard({ label, icon, value, unit, aside, footer, accent = false }: KpiCardProps) {
  return (
    <div
      className={cn(
        'group relative isolate flex flex-col gap-4 overflow-hidden p-5 transition-[box-shadow,translate] duration-(--t-sheet) ease-out-expo hover:-translate-y-0.5',
        accent ? 'rounded-card-sm bg-hero text-white shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_16px_32px_-20px_oklch(0.4_0.095_263/.8)]' : `${panelSurface} hover:shadow-e1`,
      )}
    >
      {accent && <span aria-hidden className="pointer-events-none absolute -top-16 -right-16 -z-10 size-48 animate-aurora rounded-full bg-[oklch(0.7_0.14_200/.5)] blur-[60px]" />}
      <div className="flex items-center justify-between">
        <span className={cn('text-[13px]', accent ? 'text-white/75' : 'text-ink-2')}>{label}</span>
        <span className={cn('grid size-7 place-items-center rounded-[8px]', accent ? 'bg-white/14 text-white' : 'bg-surface-sunken text-ink-2')}>
          <Icon as={icon} size={14} strokeWidth={1.8} />
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="flex items-baseline gap-1.5">
          <span className="text-[32px] leading-none font-light tracking-[-0.05em]"><CountUp value={value} /></span>
          {unit && <span className={cn('text-[13px]', accent ? 'text-white/70' : 'text-ink-3')}>{unit}</span>}
        </span>
        {aside}
      </div>
      <div className={cn('text-xs', accent ? 'text-white/75' : 'text-ink-3')}>{footer}</div>
    </div>
  );
}

function StreakWeek() {
  const t = useTranslations('calendar');
  const days = t('weekdays').split(',');
  return (
    <div className="flex gap-1" aria-hidden>
      {KPI.streak.week.map((done, i) => (
        <span key={days[i]} className="flex flex-col items-center gap-1">
          <span className={cn('h-5 w-2 rounded-[3px]', done ? 'bg-warning' : 'bg-track')} />
          <span className="font-mono text-[9px] text-ink-3">{days[i][0]}</span>
        </span>
      ))}
    </div>
  );
}

export function KpiCards() {
  const t = useTranslations('dashboard.kpi');
  const tc = useTranslations('dashboard.countdown');
  const examProgress = `${(KPI.exam.elapsed / KPI.exam.total) * 100}%`;

  return (
    <div className="stagger grid grid-cols-2 gap-4 xl:grid-cols-4">
      <KpiCard
        label={t('score')}
        icon={ChartNoAxesColumnIncreasing}
        value={KPI.score.value}
        unit={`/ ${MAX_SCORE}`}
        aside={<Sparkline data={SCORE_TREND} width={96} height={32} />}
        footer={<span className="flex items-center gap-2"><Trend value={KPI.score.delta} />{t('scoreHint')}</span>}
      />
      <KpiCard
        accent
        label={t('exam')}
        icon={CalendarDays}
        value={MOCK_EXAM.daysLeft}
        unit={tc('days')}
        footer={
          <span className="flex flex-col gap-2">
            <span className="block h-1 overflow-hidden rounded-[2px] bg-white/20">
              <Grow width={examProgress} className="h-full rounded-[2px] bg-white" />
            </span>
            {t('examHint', { date: tc('date'), level: MOCK_EXAM.target })}
          </span>
        }
      />
      <KpiCard
        label={t('streak')}
        icon={Flame}
        value={KPI.streak.value}
        unit={t('streakUnit')}
        aside={<StreakWeek />}
        footer={t('streakHint', { best: KPI.streak.best })}
      />
      <KpiCard
        label={t('time')}
        icon={Clock3}
        value={KPI.time.value}
        unit={t('timeUnit')}
        footer={
          <span className="flex flex-col gap-2">
            <ProgressBar value={KPI.time.value} max={KPI.time.goal} tone="green" />
            {t('timeHint', { goal: KPI.time.goal })}
          </span>
        }
      />
    </div>
  );
}
