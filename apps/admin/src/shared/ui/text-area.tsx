import type { ComponentProps } from 'react';
import { cn } from '@cefr/ui/lib/cn';

export function TextArea({ className, rows = 3, ...rest }: ComponentProps<'textarea'>) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'w-full rounded-input bg-surface px-[14px] py-3 text-[15px] leading-relaxed text-ink caret-green shadow-inset outline-none transition-shadow duration-(--t-fast) placeholder:text-ink-disabled focus:shadow-focus',
        className,
      )}
      {...rest}
    />
  );
}
