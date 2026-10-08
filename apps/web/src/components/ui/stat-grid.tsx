import { cn } from '@/lib/cn';
import { CountUp } from '@/components/motion/count-up';

export type Stat = { value: string | number; label: string; tone?: 'default' | 'warning' | 'error' | 'success' | 'muted' };

const TONE = {
  default: 'text-ink',
  warning: 'text-warning-text',
  error: 'text-error-text',
  success: 'text-success',
  muted: 'text-ink-2',
} as const;

type StatGridProps = { stats: readonly Stat[]; size?: 'sm' | 'md' | 'lg'; className?: string };

const SIZE = {
  sm: { cell: 'px-[14px] py-3', value: 'text-[22px]', radius: 'rounded-2xl' },
  md: { cell: 'px-4 py-[14px]', value: 'text-[22px] tracking-[-0.03em]', radius: 'rounded-card-sm' },
  lg: { cell: 'px-[18px] py-4', value: 'text-[26px] tracking-[-0.03em]', radius: 'rounded-card-sm' },
} as const;

export function StatGrid({ stats, size = 'md', className }: StatGridProps) {
  const s = SIZE[size];
  return (
    <div className={cn('grid bg-surface-muted', s.radius, className)} style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map((stat, i) => (
        <div key={stat.label} className={cn('flex flex-col gap-0.5', s.cell, i > 0 && 'shadow-[-1px_0_0_var(--divider-muted)]')}>
          <span className={cn('font-mono', s.value, TONE[stat.tone ?? 'default'])}>
            {typeof stat.value === 'number' ? <CountUp value={stat.value} duration={1.2} delay={i * 0.08} /> : stat.value}
          </span>
          <span className="text-xs text-ink-2">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
