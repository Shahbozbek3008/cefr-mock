import { cn } from '@/lib/cn';
import { CountUp } from '@/components/motion/count-up';
import { ProgressBar, type ProgressTone } from './progress-bar';

export type Criterion = { name: string; score: number; max: number; tone?: ProgressTone };

type CriteriaListProps = {
  items: readonly Criterion[];
  columns?: string;
  rowClassName?: string;
  className?: string;
};

export function CriteriaList({ items, columns = '1fr 110px 44px', rowClassName, className }: CriteriaListProps) {
  return (
    <div className={className}>
      {items.map((c, i) => (
        <div
          key={c.name}
          className={cn('grid h-[46px] items-center gap-[14px] text-sm shadow-[0_1px_0_var(--divider)] last:shadow-none', rowClassName)}
          style={{ gridTemplateColumns: columns }}
        >
          <span>{c.name}</span>
          <ProgressBar value={c.score} max={c.max} tone={c.tone} delay={i * 0.1} />
          <span className="text-right font-mono text-[13px]">
            <CountUp value={c.score} delay={i * 0.1} />
            <span className="text-ink-3">/{c.max}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
