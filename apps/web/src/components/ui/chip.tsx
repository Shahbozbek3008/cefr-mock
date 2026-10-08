import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { ActivePill } from '@/components/motion/active-pill';

type ChipProps = ComponentProps<'button'> & { active?: boolean; layoutId?: string };

export function Chip({ active, layoutId, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'relative isolate flex h-[34px] items-center whitespace-nowrap rounded-pill px-[14px] text-[13px] transition-[background-color,color,box-shadow,scale] duration-(--t-base) ease-out-expo active:scale-95',
        active ? 'font-medium text-green-text' : 'bg-surface text-ink-body shadow-inset hover:bg-bg-app',
        active && !layoutId && 'bg-green-100',
        className,
      )}
      {...rest}
    >
      {active && layoutId && <ActivePill layoutId={layoutId} className="rounded-pill bg-green-100" />}
      {children}
    </button>
  );
}
