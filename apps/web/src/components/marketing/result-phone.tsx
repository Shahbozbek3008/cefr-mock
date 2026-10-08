import { useTranslations } from 'next-intl';
import { MAX_SCORE } from '@/lib/constants';
import { LATEST_RESULT } from '@/lib/mock/results';
import { cn } from '@/lib/cn';
import { Gauge, ScoreValue } from '@/components/ui/gauge';
import { Tag } from '@/components/ui/tag';
import { ProgressBar } from '@/components/ui/progress-bar';
import { AiTip } from '@/components/ui/ai-tip';
import { CountUp } from '@/components/motion/count-up';

const VARIANTS = {
  full: {
    frame: 'h-[620px] w-[300px] rounded-[44px] px-4 pt-[50px] gap-3 shadow-[0_0_0_1px_#d9dade,0_0_0_8px_#fcfcfd,0_0_0_9px_#dcdde1,0_60px_100px_-40px_rgba(20,22,30,.35),0_30px_60px_-30px_rgba(20,22,30,.2)]',
    notch: 'top-2.5 h-7 w-24 rounded-2xl',
    gauge: { size: 180, stroke: 10, r: 76, height: 150, labelOffset: 18, value: 52 },
    rows: 4,
    row: 'h-10 text-xs grid-cols-[1fr_70px_26px] gap-2.5',
  },
  compact: {
    frame: 'h-[340px] w-[250px] rounded-t-[38px] px-[14px] pt-10 gap-2.5 shadow-[0_0_0_1px_#d9dade,0_0_0_7px_#fcfcfd,0_0_0_8px_#dcdde1,0_30px_60px_-20px_rgba(20,22,30,.3)]',
    notch: 'top-[9px] h-6 w-20 rounded-[14px]',
    gauge: { size: 130, stroke: 8, r: 54, height: 110, labelOffset: 12, value: 38 },
    rows: 2,
    row: 'h-[34px] text-[11px] grid-cols-[1fr_60px_22px] gap-2',
  },
} as const;

export function ResultPhone({ variant, className }: { variant: keyof typeof VARIANTS; className?: string }) {
  const t = useTranslations('landing.hero.phone');
  const tSkills = useTranslations('skills');
  const tAi = useTranslations('landing.ai.card');
  const v = VARIANTS[variant];
  const full = variant === 'full';

  return (
    <div className={cn('relative flex flex-col overflow-hidden bg-[#f6f6f7]', v.frame, className)}>
      <span className={cn('absolute left-1/2 z-10 -translate-x-1/2 bg-[#0c0c0e]', v.notch)} aria-hidden />
      <span className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(120deg,rgba(255,255,255,.55),transparent_32%)]" aria-hidden />
      {full && (
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[13px] font-medium">{t('title')}</span>
          <span className="font-mono text-[10px] text-[#93959d]">{LATEST_RESULT.testName}</span>
        </div>
      )}
      <div className={cn('flex flex-col items-center gap-1.5 bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.04)]', full ? 'rounded-card px-4 pt-[18px] pb-4 shadow-[0_0_0_1px_rgba(20,22,30,.04),0_12px_28px_-14px_rgba(20,22,30,.14)]' : 'rounded-[20px] p-[14px]')}>
        <Gauge value={LATEST_RESULT.total} max={MAX_SCORE} size={v.gauge.size} stroke={v.gauge.stroke} r={v.gauge.r} height={v.gauge.height} labelOffset={v.gauge.labelOffset}>
          <ScoreValue value={LATEST_RESULT.total} max={MAX_SCORE} size={v.gauge.value} maxClassName={full ? 'text-[11px] text-[#93959d]' : 'text-[10px] text-[#93959d]'} />
        </Gauge>
        <Tag size={full ? 'lg' : 'sm'} className={full ? 'h-[26px] rounded-[9px] px-2.5' : ''}>{t(full ? 'level' : 'levelShort')}</Tag>
      </div>
      <div className={cn('bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.05)]', full ? 'rounded-[20px] px-[14px] py-1' : 'rounded-2xl px-3 py-0.5')}>
        {LATEST_RESULT.skills.slice(0, v.rows).map((s, i) => (
          <div key={s.skill} className={cn('grid items-center shadow-[0_1px_0_var(--divider)]', v.row)}>
            <span>{tSkills(s.skill)}</span>
            <ProgressBar value={s.score} max={MAX_SCORE} size="xs" delay={0.5 + i * 0.12} />
            <span className={cn('text-right font-mono', full ? 'text-[11px]' : 'text-[10px]')}><CountUp value={s.score} delay={0.5 + i * 0.12} /></span>
          </div>
        ))}
      </div>
      {full && <AiTip className="rounded-2xl text-xs">{tAi('summary')}</AiTip>}
    </div>
  );
}
