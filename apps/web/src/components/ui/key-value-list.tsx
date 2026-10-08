import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type KeyValue = { label: string; value: ReactNode };

type KeyValueListProps = { items: readonly KeyValue[]; variant?: 'plain' | 'muted'; className?: string };

export function KeyValueList({ items, variant = 'plain', className }: KeyValueListProps) {
  const muted = variant === 'muted';
  return (
    <div className={cn('flex flex-col', muted && 'rounded-card-sm bg-surface-muted px-[18px] py-1.5 text-left', className)}>
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            'flex items-center justify-between text-sm',
            muted ? 'h-11' : 'pt-[14px] first:pt-0',
            i > 0 && (muted ? 'shadow-[0_-1px_0_var(--divider-muted)]' : 'shadow-[0_-1px_0_var(--divider)]'),
            !muted && i > 0 && 'mt-[18px]',
          )}
        >
          <span className="text-ink-2">{item.label}</span>
          <span className={cn(!muted && 'font-medium')}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
