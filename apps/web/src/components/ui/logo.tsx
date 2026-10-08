import { cn } from '@/lib/cn';

const SIZES = {
  sm: { box: 22, radius: 7, inner: 8, border: 1.75, inset: 2.5 },
  md: { box: 24, radius: 7.44, inner: 9.12, border: 2, inset: 3 },
  lg: { box: 26, radius: 8, inner: 10, border: 2, inset: 3 },
} as const;

type LogoMarkProps = { size?: keyof typeof SIZES };

export function LogoMark({ size = 'lg' }: LogoMarkProps) {
  const s = SIZES[size];
  return (
    <span
      className="grid shrink-0 place-items-center bg-action shadow-[inset_0_1px_0_rgba(255,255,255,.22)]"
      style={{ width: s.box, height: s.box, borderRadius: s.radius }}
      aria-hidden
    >
      <span className="border-white" style={{ width: s.inner, height: s.inner, borderRadius: s.inset, borderWidth: s.border }} />
    </span>
  );
}

type LogoProps = LogoMarkProps & { className?: string };

export function Logo({ size, className }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.02em] text-ink', className)}>
      <LogoMark size={size} />
      CEFR Mock
    </span>
  );
}
