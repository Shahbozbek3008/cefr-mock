'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT, VIEWPORT } from '@/lib/motion';

type SparklineProps = { data: readonly number[]; width?: number; height?: number; color?: string };

export function Sparkline({ data, width = 120, height = 36, color = 'var(--green-500)' }: SparklineProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const min = Math.min(...data);
  const range = Math.max(...data) - min || 1;
  const points = data.map((v, i) => [(i / (data.length - 1)) * (width - 4) + 2, height - 3 - ((v - min) / range) * (height - 8)] as const);
  const line = points.map(([x, y]) => `${x},${y}`).join(' ');
  const [lx, ly] = points.at(-1)!;

  return (
    <motion.svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden initial={reduced ? false : 'hidden'} whileInView="visible" viewport={VIEWPORT}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={`2,${height} ${line} ${lx},${height}`}
        fill={`url(#${id})`}
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8, delay: 0.6 } } }}
      />
      <motion.polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 1.2, ease: EASE_OUT } } }}
      />
      <motion.circle
        cx={lx}
        cy={ly}
        r="2.75"
        fill="#fff"
        stroke={color}
        strokeWidth="1.75"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        variants={{ hidden: { scale: 0 }, visible: { scale: 1, transition: { delay: 1.05, type: 'spring', bounce: 0.5 } } }}
      />
    </motion.svg>
  );
}
