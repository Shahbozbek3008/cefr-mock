import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';
import { pct } from '@/lib/format';
import { Grow } from '@/components/motion/grow';

const trackVariants = cva('relative overflow-hidden bg-track', {
  variants: {
    size: { xs: 'h-[3px] rounded-[2px]', sm: 'h-1 rounded-[2px]', md: 'h-[5px] rounded-[3px]', lg: 'h-1.5 rounded-[3px]' },
    surface: { default: '', muted: 'bg-divider-page' },
  },
  defaultVariants: { size: 'sm', surface: 'default' },
});

const FILL = { blue: 'bg-blue', warning: 'bg-warning', green: 'bg-green' } as const;
export type ProgressTone = keyof typeof FILL;

type ProgressBarProps = VariantProps<typeof trackVariants> & {
  value: number;
  max?: number;
  tone?: ProgressTone;
  delay?: number;
  className?: string;
};

export function ProgressBar({ value, max = 100, tone = 'blue', size, surface, delay, className }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(trackVariants({ size, surface }), className)}
    >
      <Grow width={pct(value, max)} delay={delay} className={cn('h-full rounded-[inherit]', FILL[tone])} />
    </div>
  );
}
