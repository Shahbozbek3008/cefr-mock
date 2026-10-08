import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type MarqueeProps = { children: ReactNode; reverse?: boolean; duration?: number; className?: string };

export function Marquee({ children, reverse = false, duration = 48, className }: MarqueeProps) {
  const style = { animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' } as CSSProperties;
  return (
    <div className={cn('group/marquee mask-fade-x flex overflow-hidden', className)}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 || undefined}
          className="flex shrink-0 animate-marquee gap-4 pr-4 group-hover/marquee:[animation-play-state:paused]"
          style={style}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
