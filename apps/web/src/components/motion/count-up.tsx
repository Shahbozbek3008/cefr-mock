'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { formatSum } from '@/lib/format';
import { EASE_OUT, VIEWPORT } from '@/lib/motion';

type CountUpProps = {
  value: number;
  duration?: number;
  delay?: number;
  grouped?: boolean;
  className?: string;
};

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const render = (n: number, grouped: boolean) => (grouped ? formatSum(Math.round(n)) : String(Math.round(n)));

export function CountUp({ value, duration = 1.6, delay = 0, grouped = false, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!reduced && ref.current) ref.current.textContent = render(0, grouped);
  }, [reduced, grouped]);

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node || reduced) return;
    const controls = animate(0, value, { duration, delay, ease: EASE_OUT, onUpdate: (v) => (node.textContent = render(v, grouped)) });
    return () => controls.stop();
  }, [inView, reduced, value, duration, delay, grouped]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {render(value, grouped)}
    </span>
  );
}
