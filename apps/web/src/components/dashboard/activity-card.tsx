'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'motion/react';
import { DAILY_GOAL, TODAY_INDEX, WEEKLY_ACTIVITY } from '@/lib/mock/dashboard';
import { EASE_OUT, VIEWPORT } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { CountUp } from '@/components/motion/count-up';
import { Panel } from './panel';

const SCALE = Math.max(...WEEKLY_ACTIVITY, DAILY_GOAL) * 1.15;
const pct = (v: number) => `${(v / SCALE) * 100}%`;

export function ActivityCard() {
  const t = useTranslations('dashboard.activity');
  const tk = useTranslations('dashboard.kpi');
  const days = useTranslations('calendar')('weekdays').split(',');
  const reduced = useReducedMotion();
  const total = WEEKLY_ACTIVITY.reduce((a, b) => a + b, 0);

  return (
    <Panel
      title={t('title')}
      subtitle={t('subtitle')}
      action={<span className="font-mono text-[13px] font-medium"><CountUp value={total} /> <span className="font-normal text-ink-3">{tk('timeUnit')}</span></span>}
    >
      <div className="flex flex-1 flex-col gap-2 px-5 pt-5 pb-4">
        <div className="relative flex h-36 items-end gap-2.5">
          <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-line-strong" style={{ bottom: pct(DAILY_GOAL) }}>
            <span className="absolute -top-2.5 right-0 bg-surface pl-1.5 font-mono text-[10px] text-ink-3">{t('goal')} · {DAILY_GOAL}</span>
          </div>
          {WEEKLY_ACTIVITY.map((value, i) => (
            <div key={days[i]} className="group relative flex h-full flex-1 items-end">
              <span className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-[6px] bg-ink px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-white opacity-0 transition-[opacity,translate] duration-(--t-base) group-hover:-translate-y-1 group-hover:opacity-100" style={{ bottom: `calc(${pct(value)} + 6px)` }}>
                {t('minutes', { value })}
              </span>
              <motion.span
                className={cn(
                  'block w-full origin-bottom rounded-t-[6px] rounded-b-[3px] transition-colors duration-(--t-base)',
                  i === TODAY_INDEX ? 'bg-action' : value >= DAILY_GOAL ? 'bg-blue/80 group-hover:bg-blue' : 'bg-blue-100 group-hover:bg-blue/60',
                )}
                style={{ height: value ? pct(value) : 3 }}
                initial={reduced ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.9, delay: i * 0.06, ease: EASE_OUT }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2.5">
          {days.map((d, i) => (
            <span key={d} className={cn('flex-1 text-center font-mono text-[10px]', i === TODAY_INDEX ? 'font-medium text-green-text' : 'text-ink-3')}>{d}</span>
          ))}
        </div>
      </div>
    </Panel>
  );
}
