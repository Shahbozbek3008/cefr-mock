import { useTranslations } from 'next-intl';
import { ChartLine, House, Layers, Lock, UserRound } from 'lucide-react';
import { LEVELS, MAX_SCORE } from '@/lib/constants';
import { MOCK_EXAM, MOCK_USER } from '@/lib/mock/user';
import { DASHBOARD_SKILLS, PROGRESS_HISTORY } from '@/lib/mock/results';
import { richTags } from '@/lib/rich';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { LogoMark } from '@/components/ui/logo';
import { ProgressBar } from '@/components/ui/progress-bar';
import { LineChart } from '@/components/ui/line-chart';
import { SectionHeading } from '@/components/ui/typography';
import { CountUp } from '@/components/motion/count-up';
import { Reveal } from '@/components/motion/reveal';
import { ScrollTilt } from '@/components/motion/scroll-tilt';
import { ScaleBar } from '@/components/app/scale-bar';
import { Container } from './container';

const NAV = [
  { key: 'home', icon: House },
  { key: 'tests', icon: Layers },
  { key: 'progress', icon: ChartLine },
  { key: 'profile', icon: UserRound },
] as const;

const THRESHOLDS = LEVELS.slice(1).map((l) => ({ value: l.min, label: `${l.code} · ${l.min}` }));

function BrowserChrome() {
  const t = useTranslations('landing.preview');
  return (
    <div className="flex h-11 items-center gap-3 px-4 shadow-[0_1px_0_var(--divider-muted)]">
      <div className="flex gap-1.5">
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="size-3 rounded-full" style={{ background: c }} />)}
      </div>
      <div className="mx-auto flex h-7 w-full max-w-[340px] items-center justify-center gap-1.5 rounded-[9px] bg-surface-sunken font-mono text-[11px] text-ink-2">
        <Icon as={Lock} size={11} strokeWidth={2} />
        {t('url')}
      </div>
      <span className="flex items-center gap-1.5 text-[11px] text-ink-2 max-sm:hidden">
        <span className="relative grid size-1.5 place-items-center">
          <span className="absolute size-1.5 animate-ping-soft rounded-full bg-green" />
          <span className="size-1.5 rounded-full bg-green" />
        </span>
        {t('live')}
      </span>
    </div>
  );
}

function MiniSidebar() {
  const t = useTranslations('app.nav');
  return (
    <div className="flex w-[200px] shrink-0 flex-col gap-5 bg-bg-sidebar px-3 py-5 shadow-[1px_0_0_rgba(20,22,30,.06)] max-lg:hidden">
      <span className="flex items-center gap-2 px-2 text-[13px] font-medium"><LogoMark size="sm" />CEFR Mock</span>
      <div className="flex flex-col gap-0.5">
        {NAV.map((n, i) => (
          <span
            key={n.key}
            className={cn('flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13px]', i === 0 ? 'bg-surface font-medium shadow-[0_0_0_1px_rgba(20,22,30,.06)]' : 'text-ink-2')}
          >
            <Icon as={n.icon} size={16} />
            {t(n.key)}
          </span>
        ))}
      </div>
    </div>
  );
}

function Countdown() {
  const t = useTranslations('dashboard.countdown');
  const [, b2, c1] = LEVELS;
  return (
    <div className="relative flex flex-col gap-5 overflow-hidden rounded-card bg-hero px-6 py-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18)]">
      <div className="grid-backdrop-light pointer-events-none absolute inset-0 bg-size-[32px_32px] mask-[radial-gradient(ellipse_70%_90%_at_100%_0%,#000,transparent_70%)]" />
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-white/72">{t('label')}</span>
          <span className="text-[52px] leading-[.95] font-light tracking-[-0.06em]">
            <CountUp value={MOCK_EXAM.daysLeft} />
            <span className="ml-1.5 text-base tracking-normal text-white/70">{t('days')}</span>
          </span>
        </div>
        <span className="flex h-6 items-center rounded-[8px] bg-white/14 px-2 text-[11px]">{t('badge', { date: t('date'), level: MOCK_EXAM.target })}</span>
      </div>
      <div className="relative">
        <ScaleBar value={MOCK_EXAM.currentScore} variant="onDark" labels={[t('now', { score: MOCK_EXAM.currentScore }), `${b2.code} · ${b2.min}`, `${c1.code} · ${c1.min}`]} />
      </div>
    </div>
  );
}

function SkillTiles() {
  const t = useTranslations('skills');
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {DASHBOARD_SKILLS.map((s, i) => (
        <div key={s.skill} className="flex flex-col gap-2.5 rounded-[18px] bg-surface p-4 shadow-[0_0_0_1px_rgba(20,22,30,.05)]">
          <span className="text-xs text-ink-2">{t(s.skill)}</span>
          <span className="text-[28px] leading-none font-light tracking-[-0.05em]">
            <CountUp value={s.score} delay={i * 0.1} />
            <span className="ml-1 font-mono text-[11px] tracking-normal text-ink-3">/{MAX_SCORE}</span>
          </span>
          <ProgressBar value={s.score} max={MAX_SCORE} size="xs" tone={s.weak ? 'warning' : 'blue'} delay={i * 0.1} />
        </div>
      ))}
    </div>
  );
}

function ChartCard() {
  const t = useTranslations('progress');
  return (
    <div className="flex flex-col gap-2 rounded-card bg-surface px-5 pt-4 pb-1 shadow-[0_0_0_1px_rgba(20,22,30,.05)] lg:col-span-2">
      <span className="text-xs text-ink-2">{t('overall')}</span>
      <LineChart data={PROGRESS_HISTORY.scores} thresholds={THRESHOLDS} label={t('chartLabel')} height={200} />
    </div>
  );
}

function DashboardMock() {
  const t = useTranslations('dashboard');
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 bg-bg-app p-4 md:p-6">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-ink-2">{t('today')}</span>
        <span className="text-xl font-medium tracking-[-0.03em] md:text-2xl">{t('greeting', { name: MOCK_USER.firstName })}</span>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <Countdown />
        <SkillTiles />
        <ChartCard />
      </div>
    </div>
  );
}

export function ProductPreview() {
  const t = useTranslations('landing.preview');
  return (
    <Container className="flex flex-col items-center gap-10 pt-20 md:gap-14 md:pt-32">
      <div className="flex flex-col items-center gap-4 text-center">
        <SectionHeading eyebrow={t('eyebrow')} title={t.rich('title', richTags)} align="center" />
        <Reveal delay={0.1} as="span" className="max-w-[520px] text-base leading-[1.6] text-ink-2">{t('text')}</Reveal>
      </div>
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-x-[8%] -top-10 h-2/3 rounded-full bg-[radial-gradient(closest-side,oklch(0.9_0.08_140/.6),transparent)] blur-3xl" />
        <ScrollTilt className="relative overflow-hidden rounded-[22px] bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.07),0_50px_100px_-40px_rgba(20,22,30,.35),0_30px_60px_-30px_rgba(20,22,30,.18)] md:rounded-hero">
          <BrowserChrome />
          <div className="flex">
            <MiniSidebar />
            <DashboardMock />
          </div>
        </ScrollTilt>
      </div>
    </Container>
  );
}
