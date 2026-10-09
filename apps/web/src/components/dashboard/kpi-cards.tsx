import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarDays, ChartNoAxesColumnIncreasing, Clock3, Flame, type LucideIcon } from 'lucide-react';
import { MAX_SCORE, ROUTES } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { CountUp } from '@/components/motion/count-up';
import { panelSurface } from './panel';
import { Sparkline } from './sparkline';
import { Trend } from './trend';

type KpiCardProps = { label: string; icon: LucideIcon; value: ReactNode; unit?: ReactNode; aside?: ReactNode; footer: ReactNode; accent?: boolean };

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
      <div className="flex min-h-8 items-end justify-between gap-3">
        <span className="flex items-baseline gap-1.5">
          <span className="text-[32px] leading-none font-light tracking-[-0.05em]">{value}</span>
          {unit && <span className={cn('text-[13px]', accent ? 'text-white/70' : 'text-ink-3')}>{unit}</span>}
        </span>
        {aside}
      </div>
      <div className={cn('min-h-4 text-xs', accent ? 'text-white/75' : 'text-ink-3')}>{footer}</div>
    </div>
  );
}

export type WeekDay = { key: string; label: string; minutes: number };

function StreakWeek({ week, loading = false }: { week: readonly WeekDay[]; loading?: boolean }) {
  return (
    <div className="flex gap-1" aria-hidden>
      {week.map((day) => (
        <span key={day.key} className="flex flex-col items-center gap-1">
          {loading ? <Skeleton className="h-5 w-2 rounded-[3px]" /> : <span className={cn('h-5 w-2 rounded-[3px]', day.minutes > 0 ? 'bg-warning' : 'bg-track')} />}
          <span className="font-mono text-[9px] text-ink-3">{day.label[0]}</span>
        </span>
      ))}
    </div>
  );
}

export type KpiData = {
  score: number | null;
  delta: number;
  trend: number[];
  daysLeft: number | null;
  examLabel: string | null;
  target: string | null;
  streak: number;
  week: WeekDay[];
  weekGoal: number;
};

export function KpiCards({ data }: { data: KpiData }) {
  const t = useTranslations('dashboard.kpi');
  const tc = useTranslations('dashboard.countdown');
  const weekMinutes = data.week.reduce((sum, day) => sum + day.minutes, 0);

  return (
    <div className="stagger grid grid-cols-2 gap-4 xl:grid-cols-4">
      <KpiCard
        label={t('score')}
        icon={ChartNoAxesColumnIncreasing}
        value={data.score === null ? '—' : <CountUp value={data.score} />}
        unit={`/ ${MAX_SCORE}`}
        aside={data.trend.length > 1 ? <Sparkline data={data.trend} width={96} height={32} /> : undefined}
        footer={data.delta !== 0 && <span className="flex items-center gap-2"><Trend value={data.delta} />{t('scoreHint')}</span>}
      />
      <KpiCard
        accent
        label={t('exam')}
        icon={CalendarDays}
        value={data.daysLeft === null ? '—' : <CountUp value={data.daysLeft} />}
        unit={data.daysLeft === null ? undefined : tc('days')}
        footer={
          data.examLabel ? (
            t('examHint', { date: data.examLabel, level: data.target ?? '—' })
          ) : (
            <Link href={ROUTES.settings} className="font-medium text-white underline underline-offset-4 hover:text-white">{t('examPick')}</Link>
          )
        }
      />
      <KpiCard
        label={t('streak')}
        icon={Flame}
        value={<CountUp value={data.streak} />}
        unit={t('streakUnit')}
        aside={<StreakWeek week={data.week} />}
        footer={data.streak === 0 && t('streakNone')}
      />
      <KpiCard
        label={t('time')}
        icon={Clock3}
        value={<CountUp value={weekMinutes} />}
        unit={t('timeUnit')}
        footer={
          <span className="flex flex-col gap-2">
            <ProgressBar value={Math.min(weekMinutes, data.weekGoal)} max={data.weekGoal} tone="green" />
            {t('timeHint', { goal: data.weekGoal })}
          </span>
        }
      />
    </div>
  );
}

export function KpiCardsSkeleton({ week }: { week: readonly WeekDay[] }) {
  const t = useTranslations('dashboard.kpi');
  const tc = useTranslations('dashboard.countdown');

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <KpiCard label={t('score')} icon={ChartNoAxesColumnIncreasing} value={<Skeleton className="h-8 w-16" />} unit={`/ ${MAX_SCORE}`} footer={<SkeletonText className="w-28" />} />
      <KpiCard accent label={t('exam')} icon={CalendarDays} value={<Skeleton tone="inverse" className="h-8 w-12" />} unit={tc('days')} footer={<SkeletonText tone="inverse" className="w-36" />} />
      <KpiCard label={t('streak')} icon={Flame} value={<Skeleton className="h-8 w-10" />} unit={t('streakUnit')} aside={<StreakWeek week={week} loading />} footer={<SkeletonText className="w-24" />} />
      <KpiCard
        label={t('time')}
        icon={Clock3}
        value={<Skeleton className="h-8 w-14" />}
        unit={t('timeUnit')}
        footer={
          <span className="flex flex-col gap-2">
            <Skeleton className="h-1 w-full rounded-[2px]" />
            <SkeletonText className="w-32" />
          </span>
        }
      />
    </div>
  );
}
