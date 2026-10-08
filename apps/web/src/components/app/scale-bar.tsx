import { LEVELS, SCALE_SEGMENTS } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { Grow } from '@/components/motion/grow';

type ScaleBarProps = {
  value: number;
  variant: 'onDark' | 'light';
  labels: readonly string[];
};

const STEP = 0.22;

export function ScaleBar({ value, variant, labels }: ScaleBarProps) {
  const dark = variant === 'onDark';

  return (
    <div className="flex flex-col gap-2">
      <div className={cn('grid', dark ? 'gap-1' : 'gap-[3px]')} style={{ gridTemplateColumns: SCALE_SEGMENTS.map((s) => `${s}fr`).join(' ') }}>
        {SCALE_SEGMENTS.map((size, i) => {
          const start = SCALE_SEGMENTS.slice(0, i).reduce((a, b) => a + b, 0);
          const ratio = Math.min(Math.max((value - start) / size, 0), 1);
          return (
            <span key={start} className={cn('h-1.5 overflow-hidden rounded-[3px]', dark ? 'bg-white/22' : 'bg-track')}>
              {ratio > 0 && <Grow width={`${ratio * 100}%`} delay={i * STEP} className={cn('h-full', dark ? 'bg-white' : 'bg-blue')} />}
            </span>
          );
        })}
      </div>
      <div className={cn('flex justify-between font-mono text-[11px]', dark ? 'text-white/72' : 'text-ink-3')}>
        {labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

export const LEVEL_LABELS = LEVELS.map((l) => `${l.code} · ${l.min}`);
