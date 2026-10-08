'use client';

import type { CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT, VIEWPORT } from '@/lib/motion';

type GrowProps = { width: string; delay?: number; className?: string; style?: CSSProperties };

export function Grow({ width, delay = 0, className, style }: GrowProps) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className} style={{ display: 'block', width, ...style }} />;
  return (
    <motion.span
      initial={{ width: 0 }}
      whileInView={{ width }}
      viewport={VIEWPORT}
      transition={{ duration: 1.3, delay, ease: EASE_OUT }}
      className={className}
      style={{ display: 'block', ...style }}
    />
  );
}
