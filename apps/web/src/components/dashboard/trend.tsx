import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import { signed } from '@/lib/format';
import { Icon } from '@/components/ui/icon';

export function Trend({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-[6px] px-1.5 font-mono text-[11px] font-medium',
        up ? 'bg-success-50 text-success' : 'bg-error-50 text-error-text',
        className,
      )}
    >
      <Icon as={up ? TrendingUp : TrendingDown} size={11} strokeWidth={2} />
      {signed(value)}
    </span>
  );
}
