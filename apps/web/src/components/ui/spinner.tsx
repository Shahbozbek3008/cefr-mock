import { cn } from '@/lib/cn';

const VIEW = 50;
const RADIUS = 20;
const STROKE_PX = 1.75;

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  const stroke = (STROKE_PX * VIEW) / size;
  return (
    <span role="presentation" className={cn('spinner inline-grid shrink-0 place-items-center', className)} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} width={size} height={size} className="animate-spinner" aria-hidden>
        <circle cx={VIEW / 2} cy={VIEW / 2} r={RADIUS} fill="none" stroke="currentColor" strokeWidth={stroke} opacity={0.18} />
        <circle
          cx={VIEW / 2}
          cy={VIEW / 2}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray="1 150"
          className="animate-spinner-dash"
        />
      </svg>
    </span>
  );
}
