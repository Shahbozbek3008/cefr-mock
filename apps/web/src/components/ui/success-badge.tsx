import { Check } from 'lucide-react';
import { Icon } from './icon';

const SIZES = { md: { box: 60, icon: 26, halo: 8 }, lg: { box: 72, icon: 32, halo: 10 } } as const;

export function SuccessBadge({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const s = SIZES[size];
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: s.box, height: s.box }}>
      <span className="absolute inset-0 animate-ping-soft rounded-full bg-green-300 [animation-iteration-count:3]" aria-hidden />
      <span
        className="relative grid size-full animate-pop place-items-center rounded-full bg-action text-white"
        style={{ boxShadow: `0 0 0 ${s.halo}px var(--green-100), 0 ${s.halo * 2}px ${s.halo * 4}px -${s.halo * 1.75}px oklch(0.45 0.14 140 / .7)` }}
      >
        <Icon as={Check} size={s.icon} strokeWidth={2.4} className="animate-pop [animation-delay:180ms]" />
      </span>
    </span>
  );
}
