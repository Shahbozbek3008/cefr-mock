'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';
import { EASE_OUT, VIEWPORT } from '@/lib/motion';
import { CountUp } from '@/components/motion/count-up';

const ARC = 0.75;

type ArcProps = { half: number; r: number; stroke: number; length: number; circumference: number; rotate: number };

function AnimatedArc({ half, r, stroke, length, circumference, rotate }: ArcProps) {
  const reduced = useReducedMotion();
  return (
    <motion.circle
      cx={half}
      cy={half}
      r={r}
      fill="none"
      stroke="var(--blue-500)"
      strokeWidth={stroke}
      strokeLinecap="round"
      transform={`rotate(${rotate} ${half} ${half})`}
      initial={{ strokeDasharray: `${reduced ? length : 0} ${circumference}` }}
      whileInView={{ strokeDasharray: `${length} ${circumference}` }}
      viewport={VIEWPORT}
      transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.15 }}
    />
  );
}

type GaugeProps = {
  value: number;
  max: number;
  size: number;
  stroke: number;
  r?: number;
  height?: number;
  labelOffset?: number;
  children: ReactNode;
  className?: string;
};

export function Gauge({ value, max, size, stroke, r = size / 2 - stroke, height = size * 0.86, labelOffset, children, className }: GaugeProps) {
  const c = 2 * Math.PI * r;
  const half = size / 2;
  const track = c * ARC;
  return (
    <div className={cn('relative', className)} style={{ width: size, height }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-x-0 top-0" aria-hidden>
        <circle cx={half} cy={half} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${track} ${c}`} transform={`rotate(135 ${half} ${half})`} />
        <AnimatedArc half={half} r={r} stroke={stroke} length={(value / max) * track} circumference={c} rotate={135} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: labelOffset ?? size * 0.1 }}>
        {children}
      </div>
    </div>
  );
}

type RingProps = { value: number; max: number; size: number; stroke: number; r?: number; children: ReactNode; className?: string };

export function Ring({ value, max, size, stroke, r = size / 2 - 6, children, className }: RingProps) {
  const c = 2 * Math.PI * r;
  const half = size / 2;
  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={half} cy={half} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <AnimatedArc half={half} r={r} stroke={stroke} length={(value / max) * c} circumference={c} rotate={-90} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

type ScoreValueProps = { value: number; max: number; size: number; className?: string; maxClassName?: string };

export function ScoreValue({ value, max, size, className, maxClassName }: ScoreValueProps) {
  return (
    <>
      <span className={cn('font-light leading-[.9] tracking-[-0.06em]', className)} style={{ fontSize: size }}>
        <CountUp value={value} />
      </span>
      <span className={cn('font-mono text-xs text-ink-3', maxClassName)}>/ {max}</span>
    </>
  );
}
