import { cn } from '@/lib/cn';

export const BRAND_NAME = 'CEFR Multilevel';

const SIZES = {
  sm: { box: 22, radius: 7, glyph: 14 },
  md: { box: 24, radius: 7.5, glyph: 15 },
  lg: { box: 26, radius: 8, glyph: 16 },
} as const;

const LEVELS = [
  { x: 1.3, y: 9, height: 5, opacity: 0.5 },
  { x: 6.3, y: 5.5, height: 8.5, opacity: 0.75 },
  { x: 11.3, y: 2, height: 12, opacity: 1 },
] as const;

type LogoMarkProps = { size?: keyof typeof SIZES };

export function LogoMark({ size = 'lg' }: LogoMarkProps) {
  const s = SIZES[size];
  return (
    <span
      className="grid shrink-0 place-items-center bg-action shadow-[inset_0_1px_0_rgba(255,255,255,.24),inset_0_-1px_0_rgba(0,0,0,.06)]"
      style={{ width: s.box, height: s.box, borderRadius: s.radius }}
      aria-hidden
    >
      <svg viewBox="0 0 16 16" width={s.glyph} height={s.glyph} fill="#fff">
        {LEVELS.map((level) => (
          <rect key={level.x} x={level.x} y={level.y} width={3.4} height={level.height} rx={1.7} opacity={level.opacity} />
        ))}
      </svg>
    </span>
  );
}

type LogoProps = LogoMarkProps & { className?: string };

export function Logo({ size, className }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5 text-[15px] tracking-[-0.02em] text-ink', className)}>
      <LogoMark size={size} />
      <span className="whitespace-nowrap">
        <span className="font-semibold">CEFR</span> <span className="font-normal text-ink-2">Multilevel</span>
      </span>
    </span>
  );
}
