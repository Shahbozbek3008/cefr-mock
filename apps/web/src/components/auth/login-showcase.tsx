import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkle } from 'lucide-react';
import { MAX_SCORE } from '@/lib/constants';
import { LATEST_RESULT } from '@/lib/mock/results';
import { Icon } from '@/components/ui/icon';
import { Ring } from '@/components/ui/gauge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CountUp } from '@/components/motion/count-up';
import { Aurora } from '@/components/marketing/aurora';

const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

export function LoginShowcase() {
  const t = useTranslations('auth.login.showcase');
  const tSkills = useTranslations('skills');
  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-[#f5f5f6] max-lg:hidden">
      <Aurora />
      <div className="relative flex w-[400px] flex-col gap-3">
        <div className="animate-fade-up" style={delay(200)}>
          <div className="flex animate-float items-center gap-5 rounded-card bg-white/90 p-[22px] shadow-[0_0_0_1px_rgba(20,22,30,.05),0_24px_48px_-24px_rgba(20,22,30,.25)] backdrop-blur-xl">
            <Ring value={LATEST_RESULT.total} max={MAX_SCORE} size={88} stroke={7} r={38}>
              <span className="text-[28px] leading-none font-light tracking-[-0.05em]"><CountUp value={LATEST_RESULT.total} /></span>
              <span className="font-mono text-[9px] text-[#93959d]">/{MAX_SCORE}</span>
            </Ring>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-ink-2">{t('label')}</span>
              <span className="text-lg font-medium tracking-[-0.02em]">{t('level')}</span>
              <span className="font-mono text-xs text-green-eyebrow">{t('growth')}</span>
            </div>
          </div>
        </div>
        <div className="ml-10 animate-fade-up" style={delay(420)}>
          <div className="flex animate-float-slow flex-col gap-2 rounded-[20px] bg-white/85 px-[18px] py-3 shadow-[0_0_0_1px_rgba(20,22,30,.05),0_20px_40px_-24px_rgba(20,22,30,.25)] backdrop-blur-xl" style={delay(-2000)}>
            {LATEST_RESULT.skills.slice(0, 3).map((s, i) => (
              <div key={s.skill} className="grid grid-cols-[80px_1fr_28px] items-center gap-3 text-xs">
                <span className="text-ink-2">{tSkills(s.skill)}</span>
                <ProgressBar value={s.score} max={MAX_SCORE} size="xs" tone={s.weak ? 'warning' : 'blue'} delay={0.6 + i * 0.12} />
                <span className="text-right font-mono">{s.score}</span>
              </div>
            ))}
          </div>
        </div>
        <span className="flex animate-fade-up items-start gap-2 px-1.5 pt-3 text-sm leading-[1.6] text-ink-2" style={delay(640)}>
          <Icon as={Sparkle} size={15} className="mt-1 shrink-0 text-blue" />
          {t('sync')}
        </span>
      </div>
    </div>
  );
}
