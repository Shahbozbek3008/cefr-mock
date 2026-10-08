'use client';

import type { ComponentProps, PointerEvent } from 'react';
import { cn } from '@/lib/cn';

const track = (e: PointerEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
};

export function Spotlight({ className, onPointerMove, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('spotlight', className)}
      onPointerMove={(e) => {
        track(e);
        onPointerMove?.(e);
      }}
      {...rest}
    />
  );
}
