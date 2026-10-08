import type { CSSProperties, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronRight, Play, Sparkle, Star } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { richTags } from '@/lib/rich';
import { formatSum } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { ButtonLink } from '@/components/ui/button';
import { Waveform } from '@/components/ui/waveform';
import { Words } from '@/components/motion/words';
import { ParallaxLayer, ParallaxScene } from '@/components/motion/parallax';
import { ResultPhone } from './result-phone';
import { Aurora } from './aurora';

const STUDENTS = 12_000;
const AVATARS = [
  { letter: 'D', hue: 135 },
  { letter: 'J', hue: 258 },
  { letter: 'M', hue: 75 },
  { letter: 'S', hue: 190 },
  { letter: 'N', hue: 28 },
] as const;

const glass = 'bg-white/88 shadow-e2 backdrop-blur-xl';
const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

function GrowthSparkline() {
  return (
    <svg width="64" height="28" viewBox="0 0 64 28" aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.15 140)" stopOpacity=".22" />
          <stop offset="100%" stopColor="oklch(0.55 0.15 140)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points="2,28 2,24 12,21 22,22 32,16 42,14 52,9 62,4 62,28" fill="url(#spark-fill)" />
      <polyline points="2,24 12,21 22,22 32,16 42,14 52,9 62,4" fill="none" stroke="var(--green-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="62" cy="4" r="3" fill="#fff" stroke="var(--green-500)" strokeWidth="2" />
    </svg>
  );
}

function TrustRow() {
  const t = useTranslations('landing.hero');
  return (
    <div className="flex animate-fade-up flex-wrap items-center gap-x-4 gap-y-3 pt-3" style={delay(720)}>
      <div className="flex -space-x-2">
        {AVATARS.map((a) => (
          <span
            key={a.letter}
            className="grid size-8 place-items-center rounded-full text-xs font-medium text-white ring-2 ring-bg"
            style={{ background: `linear-gradient(155deg, oklch(0.7 0.12 ${a.hue}), oklch(0.55 0.13 ${a.hue}))` }}
          >
            {a.letter}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5 text-[13px]">
          <span className="flex text-warning">
            {Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill="currentColor" strokeWidth={0} aria-hidden />)}
          </span>
          <span className="font-medium">4.9</span>
          <span className="text-ink-2">{t('rating')}</span>
        </span>
        <span className="text-[13px] text-ink-2">{t('trust', { count: formatSum(STUDENTS) })}</span>
      </div>
    </div>
  );
}

function HeroCopy() {
  const t = useTranslations('landing.hero');
  return (
    <div className="flex flex-col gap-[22px] md:gap-7">
      <a
        href="#format"
        className="border-beam group flex h-[30px] animate-fade-up items-center gap-2 self-start rounded-pill bg-surface pr-2.5 pl-1 text-xs text-ink-body shadow-[0_0_0_1px_rgba(20,22,30,.07),0_1px_2px_rgba(20,22,30,.04)] hover:text-ink md:h-8 md:gap-2.5 md:pr-3 md:text-[13px]"
      >
        <span className="flex h-[22px] items-center rounded-pill bg-green-100 px-2 text-[11px] font-medium text-green-text md:h-6 md:px-[9px] md:text-xs">2026</span>
        <span className="max-md:hidden">{t('announcement')}</span>
        <span className="md:hidden">{t('announcementShort')}</span>
        <Icon as={ChevronRight} size={14} strokeWidth={1.75} className="transition-transform duration-(--t-base) group-hover:translate-x-0.5 max-md:hidden" />
      </a>
      <h1 className="m-0 text-[44px] leading-none font-medium tracking-[-0.052em] md:text-[clamp(44px,6vw,78px)] md:leading-[.98]">
        <Words delay={120}>{t.rich('title', { ...richTags, br: () => <br className="max-md:hidden" /> })}</Words>
      </h1>
      <p className="m-0 max-w-[460px] animate-fade-up text-base leading-[1.55] text-ink-2 md:text-lg md:leading-[1.6]" style={delay(420)}>
        {t('subtitle')}
      </p>
      <div className="flex animate-fade-up flex-col gap-1.5 md:flex-row md:flex-wrap md:items-center md:gap-2.5" style={delay(540)}>
        <ButtonLink href={ROUTES.start} arrow className="max-md:h-[54px] md:min-w-[220px]">{t('cta')}</ButtonLink>
        <a href="#steps" className="group flex h-[46px] items-center justify-center gap-2.5 rounded-btn px-[18px] text-[15px] font-medium text-ink transition-colors hover:bg-hover hover:text-ink md:h-[52px]">
          <span className="relative grid size-[26px] place-items-center rounded-full bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.08)] transition-transform duration-(--t-sheet) ease-spring group-hover:scale-110 md:size-7">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-green-100" />
            <Play size={10} fill="currentColor" strokeWidth={0} aria-hidden className="relative" />
          </span>
          {t('how')}
        </a>
      </div>
      <div className="flex animate-fade-up flex-wrap gap-7 text-[13px] text-ink-2 max-md:hidden" style={delay(640)}>
        {(['noCard', 'platforms'] as const).map((k) => (
          <span key={k} className="flex items-center gap-2">
            <Icon as={Check} size={15} strokeWidth={2} className="text-[oklch(0.5_0.14_140)]" />
            {t(k)}
          </span>
        ))}
      </div>
      <TrustRow />
    </div>
  );
}

function FloatingCard({ depth, className, delayMs, float = 'animate-float', children }: { depth: number; className: string; delayMs: number; float?: string; children: ReactNode }) {
  return (
    <ParallaxLayer depth={depth} className={cn('absolute max-md:hidden', className)}>
      <div className="animate-fade-up" style={delay(delayMs)}>
        <div className={float} style={delay(delayMs)}>{children}</div>
      </div>
    </ParallaxLayer>
  );
}

function HeroVisual() {
  const t = useTranslations('landing.hero');
  return (
    <ParallaxScene className="relative flex justify-center md:h-[660px] md:items-center">
      <div className="pointer-events-none absolute inset-x-[10%] top-[18%] bottom-[12%] rounded-full bg-[radial-gradient(closest-side,oklch(0.86_0.11_140/.55),transparent)] blur-2xl max-md:hidden" />
      <ParallaxLayer depth={10} tilt={5} className="relative max-md:hidden">
        <div className="animate-fade-up" style={delay(260)}>
          <ResultPhone variant="full" />
        </div>
      </ParallaxLayer>
      <ResultPhone variant="compact" className="mt-1 animate-fade-up md:hidden" />

      <FloatingCard depth={30} delayMs={700} className="top-[16%] left-0">
        <div className={`${glass} flex w-[224px] flex-col gap-2.5 rounded-[20px] p-[14px]`}>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              <Icon as={Sparkle} size={13} strokeWidth={1.8} className="text-blue" />
              {t('aiFix')}
            </span>
            <span className="font-mono text-[10px] text-[#93959d]">Writing</span>
          </div>
          <div className="text-[13px] leading-[1.55] text-ink-body">
            People <span className="text-error-text line-through decoration-error/70">believes</span>{' '}
            <span className="rounded bg-green-100 px-[3px] font-medium text-[oklch(0.36_0.11_140)]">believe</span> that…
          </div>
        </div>
      </FloatingCard>

      <FloatingCard depth={44} delayMs={880} float="animate-float-slow" className="top-[2%] -right-4">
        <div className={`${glass} flex w-[190px] items-center gap-3 rounded-[18px] px-3 py-2.5`}>
          <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-error-50">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-error/20" />
            <span className="size-2.5 rounded-[3px] bg-error" />
          </span>
          <Waveform progress={1} live className="h-6" />
          <span className="font-mono text-[10px] text-ink-2">0:36</span>
        </div>
      </FloatingCard>

      <FloatingCard depth={24} delayMs={1040} className="right-0 bottom-[18%]">
        <div className={`${glass} flex items-center gap-3 rounded-card-sm px-[14px] py-3`}>
          <GrowthSparkline />
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[15px] font-medium text-success">+14</span>
            <span className="text-[11px] text-ink-2">{t('growth')}</span>
          </div>
        </div>
      </FloatingCard>

      <div className="absolute bottom-[110px] -left-1.5 flex animate-fade-up items-center gap-2 rounded-[14px] bg-surface px-[11px] py-[9px] shadow-[0_0_0_1px_rgba(20,22,30,.06),0_16px_32px_-14px_rgba(20,22,30,.3)] md:hidden" style={delay(600)}>
        <span className="font-mono text-[13px] font-medium text-success">+14</span>
        <span className="text-[11px] text-ink-2">{t('growth')}</span>
      </div>
    </ParallaxScene>
  );
}

export function Hero() {
  return (
    <section className="relative -mt-14 overflow-hidden pt-14 md:-mt-(--header-h) md:pt-(--header-h)">
      <Aurora />
      <div className="relative mx-auto grid max-w-page grid-cols-[repeat(auto-fit,minmax(min(100%,480px),1fr))] items-center gap-[22px] px-5 pt-7 md:gap-16 md:px-8 md:pt-[88px] md:pb-24">
        <HeroCopy />
        <HeroVisual />
      </div>
    </section>
  );
}
