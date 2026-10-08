import { cn } from '@/lib/cn';

const BLOBS = [
  { className: '-top-[18%] right-[-12%] h-[70%] w-[62%] bg-[oklch(0.93_0.09_135/.9)]', duration: '20s', delay: '0s' },
  { className: 'top-[22%] right-[18%] h-[46%] w-[38%] bg-[oklch(0.9_0.06_258/.75)]', duration: '24s', delay: '-6s' },
  { className: '-bottom-[20%] -left-[12%] h-[50%] w-[46%] bg-[oklch(0.95_0.05_95/.7)]', duration: '28s', delay: '-12s' },
] as const;

export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {BLOBS.map((b) => (
        <span
          key={b.className}
          className={cn('absolute animate-aurora rounded-full blur-[90px] will-change-transform', b.className)}
          style={{ animationDuration: b.duration, animationDelay: b.delay }}
        />
      ))}
      <div className="grid-backdrop absolute inset-0 bg-size-[64px_64px] mask-[radial-gradient(ellipse_70%_60%_at_60%_35%,#000_15%,transparent_75%)] max-md:bg-size-[44px_44px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-bg" />
    </div>
  );
}
