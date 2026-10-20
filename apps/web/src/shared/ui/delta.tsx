import { cn } from '@cefr/ui/lib/cn';
import { signed } from '@cefr/ui/lib/format';

export function Delta({ value, className }: { value: number; className?: string }) {
  return <span className={cn('font-mono text-xs', value >= 0 ? 'text-success' : 'text-error-text', className)}>{signed(value)}</span>;
}
