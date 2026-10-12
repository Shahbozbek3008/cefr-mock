'use client';

import type { ReactNode } from 'react';
import { Tooltip as RTooltip } from 'radix-ui';

export const TooltipProvider = RTooltip.Provider;

type TooltipProps = { label: ReactNode; side?: 'top' | 'right' | 'bottom' | 'left'; disabled?: boolean; children: ReactNode };

export function Tooltip({ label, side = 'right', disabled = false, children }: TooltipProps) {
  if (disabled) return children;
  return (
    <RTooltip.Root>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          side={side}
          sideOffset={10}
          className="z-50 flex items-center gap-2 rounded-[8px] bg-ink px-2 py-1 text-xs font-medium whitespace-nowrap text-white shadow-e2 data-[state=closed]:animate-menu-out data-[state=delayed-open]:animate-menu-in data-[state=instant-open]:animate-menu-in"
        >
          {label}
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  );
}
