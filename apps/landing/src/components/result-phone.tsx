import { useTranslations } from 'next-intl';
import { MAX_SCORE } from '@cefr/ui/lib/constants';
import { LATEST_RESULT } from '@/constants/demo';
import { cn } from '@cefr/ui/lib/cn';
import { Gauge, ScoreValue } from '@cefr/ui/components/gauge';
import { Tag } from '@cefr/ui/components/tag';
import { ProgressBar } from '@cefr/ui/components/progress-bar';
import { AiTip } from '@cefr/ui/components/ai-tip';
import { CountUp } from '@cefr/ui/motion/count-up';
import { PHONE_VARIANTS } from '@/constants/ui';

export function ResultPhone({ variant, className }: { variant: keyof typeof PHONE_VARIANTS; className?: string }) {
  const t = useTranslations('landing.hero.phone');
  const tSkills = useTranslations('skills');
  const tAi = useTranslations('landing.ai.card');
  const v = PHONE_VARIANTS[variant];
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
