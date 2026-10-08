import { cn } from '@/lib/cn';
import { WAVE_HEIGHTS } from '@/lib/mock/waveform';

const BAR_COUNT = 240;

type WaveformProps = {
  progress: number;
  live?: boolean;
  className?: string;
};

function Bars({ tone, live = false }: { tone: string; live?: boolean }) {
  return (
    <div className="flex h-full w-max items-center gap-[3px]">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <span
          key={i}
          className={cn('w-[3px] shrink-0 rounded-full', tone, live && 'origin-center animate-wave')}
          style={{ height: `${Math.max(WAVE_HEIGHTS[i % WAVE_HEIGHTS.length], 14)}%`, animationDelay: live ? `${-((i * 137) % 1100)}ms` : undefined }}
        />
      ))}
    </div>
  );
}

export function Waveform({ progress, live = false, className }: WaveformProps) {
  const played = `${Math.min(Math.max(progress, 0), 1) * 100}%`;
  return (
    <div className={cn('relative min-w-0 flex-1 overflow-hidden', className)} aria-hidden>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${played})` }}>
        <Bars tone="bg-wave-idle" />
      </div>
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: played }}>
        <Bars tone="bg-blue" live={live} />
      </div>
    </div>
  );
}
