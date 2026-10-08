'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';
import { EASE_OUT, VIEWPORT } from '@/lib/motion';

type Threshold = { value: number; label: string };

type LineChartProps = {
  data: readonly number[];
  thresholds?: readonly Threshold[];
  label: string;
  height?: number;
  axisLabels?: readonly string[];
  pointLabels?: readonly string[];
  className?: string;
};

const PAD = { top: 20, right: 52, bottom: 12, left: 8 };
const DRAW = 1.4;

function smoothPath(points: readonly (readonly [number, number])[]) {
  return points.reduce((path, [x, y], i) => {
    if (i === 0) return `M ${x},${y}`;
    const [px, py] = points[i - 1];
    const cx = (x - px) / 2.4;
    return `${path} C ${px + cx},${py} ${x - cx},${y} ${x},${y}`;
  }, '');
}

function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

export function LineChart({ data, thresholds = [], label, height = 240, axisLabels, pointLabels, className }: LineChartProps) {
  const [ref, width] = useWidth();
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const reduced = useReducedMotion();

  const values = [...data, ...thresholds.map((t) => t.value)];
  const min = Math.min(...values) - 3;
  const max = Math.max(...values) + 3;
  const innerW = Math.max(width - PAD.left - PAD.right, 0);
  const innerH = height - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / Math.max(data.length - 1, 1)) * innerW;
  const y = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * innerH;
  const points = data.map((v, i) => [x(i), y(v)] as const);
  const line = smoothPath(points);
  const area = `${line} L ${x(data.length - 1)},${height - PAD.bottom} L ${PAD.left},${height - PAD.bottom} Z`;
  const step = innerW / Math.max(data.length - 1, 1);
  const focus = active ?? data.length - 1;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div ref={ref} className="relative w-full" style={{ height }} onPointerLeave={() => setActive(null)}>
        {width > 0 && (
          <motion.svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={label}
            className="absolute inset-0 overflow-visible"
            initial={reduced ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--blue-500)" stopOpacity="0.14" />
                <stop offset="100%" stopColor="var(--blue-500)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {thresholds.map((t) => (
              <g key={t.label}>
                <line x1={PAD.left} x2={width - PAD.right + 8} y1={y(t.value)} y2={y(t.value)} stroke="var(--border)" strokeDasharray="3 4" />
                <text x={width - 2} y={y(t.value) + 3.5} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill="var(--text-3)">{t.label}</text>
              </g>
            ))}
            <line
              x1={points[focus][0]}
              x2={points[focus][0]}
              y1={PAD.top - 8}
              y2={height - PAD.bottom}
              stroke="var(--border-strong)"
              strokeDasharray="2 3"
              className={cn('transition-opacity duration-(--t-fast)', active === null && 'opacity-0')}
            />
            <motion.path
              d={area}
              fill={`url(#${gradientId})`}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1, delay: DRAW * 0.5 } } }}
            />
            <motion.path
              d={line}
              fill="none"
              stroke="var(--blue-500)"
              strokeWidth="2"
              strokeLinecap="round"
              variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: DRAW, ease: EASE_OUT } } }}
            />
            {points.map(([px, py], i) => (
              <motion.circle
                key={i}
                cx={px}
                cy={py}
                r={i === focus ? 5 : 3}
                fill={i === focus ? '#fff' : 'var(--blue-500)'}
                stroke="var(--blue-500)"
                strokeWidth={i === focus ? 2.5 : 0}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                variants={{ hidden: { scale: 0 }, visible: { scale: 1, transition: { delay: (i / data.length) * DRAW, type: 'spring', bounce: 0.45 } } }}
              />
            ))}
            {points.map(([px], i) => (
              <rect key={i} x={px - step / 2} y={0} width={step} height={height} fill="transparent" onPointerEnter={() => setActive(i)} />
            ))}
          </motion.svg>
        )}
        {width > 0 && active !== null && (
          <div
            className="pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center rounded-[8px] bg-ink px-2 py-1 text-center whitespace-nowrap text-white shadow-e2"
            style={{ left: points[active][0], top: points[active][1] - 12 }}
          >
            {pointLabels && <span className="text-[10px] text-white/60">{pointLabels[active]}</span>}
            <span className="font-mono text-xs font-medium">{data[active]}</span>
          </div>
        )}
      </div>
      {axisLabels && (
        <div className="flex justify-between font-mono text-[10px] text-ink-3" style={{ paddingLeft: PAD.left, paddingRight: PAD.right }}>
          {axisLabels.map((l) => <span key={l}>{l}</span>)}
        </div>
      )}
    </div>
  );
}
