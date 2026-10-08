import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Lock } from 'lucide-react';
import { SKILL_ICONS, type Skill } from '@/lib/constants';
import { richTags } from '@/lib/rich';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Waveform } from '@/components/ui/waveform';
import { SectionHeading } from '@/components/ui/typography';
import { CountUp } from '@/components/motion/count-up';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { Spotlight } from '@/components/motion/spotlight';
import { Grow } from '@/components/motion/grow';
import { Container } from './container';

type FormatCardProps = { skill: Skill; wide: boolean; children: ReactNode };

function FormatCard({ skill, wide, children }: FormatCardProps) {
  const t = useTranslations('landing.format.cards');
  return (
    <StaggerItem className={cn('flex min-w-0', wide ? 'md:flex-[7_1_440px]' : 'md:flex-[5_1_320px]')}>
      <Spotlight className="group flex w-full flex-col gap-[18px] rounded-card bg-surface p-5 shadow-e0 transition-[box-shadow,translate] duration-(--t-slow) ease-out-expo hover:-translate-y-1 hover:shadow-e2 md:min-h-[340px] md:gap-8 md:rounded-card-lg md:p-8">
        <div className="flex flex-col gap-1.5 md:gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-ink-3 max-md:uppercase md:text-xs md:text-[#93959d]">{t(`${skill}.meta`)}</span>
            <span className="grid size-9 place-items-center rounded-[11px] bg-surface-sunken text-ink-body transition-[background-color,color,rotate,scale] duration-(--t-sheet) ease-spring group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-green-100 group-hover:text-green-text max-md:hidden">
              <Icon as={SKILL_ICONS[skill]} size={17} />
            </span>
          </div>
          <h3 className="m-0 text-xl font-medium tracking-[-0.03em] md:text-2xl">{t(`${skill}.title`)}</h3>
          <p className="m-0 max-w-[380px] text-sm leading-normal text-ink-2 md:text-[15px] md:leading-[1.55]">{t(`${skill}.desc`)}</p>
        </div>
        <div className="relative rounded-2xl bg-surface-muted p-[14px] md:mt-auto md:rounded-[20px] md:p-[18px]">{children}</div>
      </Spotlight>
    </StaggerItem>
  );
}

function ListeningDemo() {
  const t = useTranslations('landing.format');
  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center gap-2.5 md:gap-[14px]">
        <span className="grid place-items-center text-ink-2 md:size-9 md:rounded-full md:bg-surface md:shadow-[0_0_0_1px_rgba(20,22,30,.06)]">
          <Icon as={Lock} size={15} strokeWidth={1.75} className="max-md:size-[14px]" />
        </span>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="relative h-1 rounded-[2px] bg-divider-page">
            <span className="absolute inset-y-0 left-0 animate-progress-loop rounded-[inherit] bg-blue">
              <span className="absolute top-1/2 right-0 size-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_2px_var(--blue-500)]" />
            </span>
          </div>
          <div className="flex justify-between font-mono text-[11px] text-[#93959d] max-md:hidden">
            <span>02:14</span><span>{t('realMode')}</span><span>06:10</span>
          </div>
        </div>
        <span className="font-mono text-[11px] text-ink-2 md:hidden">02:14</span>
      </div>
      <div className="flex flex-wrap items-center gap-2.5 pt-[14px] text-[15px] shadow-[0_-1px_0_var(--divider-muted)] max-md:hidden">
        <span className="font-mono text-xs text-[#93959d]">Q8</span>
        Student fee per year: £
        <span className="flex h-[34px] min-w-[84px] items-center rounded-sm bg-surface px-3 font-mono text-sm shadow-focus">
          35<span className="ml-0.5 h-4 w-[1.5px] animate-caret bg-green" />
        </span>
      </div>
    </div>
  );
}

function ReadingDemo() {
  const t = useTranslations('landing.format');
  return (
    <>
      <div className="absolute -top-4 left-[76px] flex h-8 animate-float items-center gap-1.5 rounded-sm bg-surface px-1.5 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_10px_20px_-10px_rgba(20,22,30,.3)] max-md:hidden">
        <span className="size-4 rounded-full bg-highlight ring-2 ring-white ring-offset-1 ring-offset-line-strong" />
        <span className="size-4 rounded-full bg-blue-100" />
        <span className="h-4 w-px bg-divider-muted" />
        <span className="px-1 text-[11px] text-ink-2">{t('note')}</span>
      </div>
      <p className="m-0 text-[13px] leading-[1.7] text-ink-body md:text-sm md:leading-[1.75]">
        Urban gardens have grown rapidly,{' '}
        <mark className="animate-sweep rounded-[3px] bg-[linear-gradient(var(--highlight),var(--highlight))] bg-no-repeat px-0.5 text-inherit [background-color:transparent]">transforming unused rooftops</mark>{' '}
        into productive spaces<span className="max-md:hidden"> that supply local markets</span>.
      </p>
    </>
  );
}

function WritingDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 max-md:hidden" aria-hidden>
        {['100%', '92%', '64%'].map((w, i) => (
          <span key={w} className="h-2 rounded bg-divider-page">
            <Grow width={w} delay={0.2 + i * 0.25} className="h-full rounded bg-line-strong/60" />
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2.5 md:gap-3 md:pt-2.5">
        <ProgressBar value={184} max={250} surface="muted" className="flex-1" />
        <span className="font-mono text-[11px] text-ink-2 md:text-xs">
          <CountUp value={184} className="font-medium text-ink" /> / 250
        </span>
      </div>
    </div>
  );
}

function SpeakingDemo() {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <span className="relative grid size-[38px] shrink-0 place-items-center rounded-full bg-surface shadow-[0_0_0_1px_rgba(20,22,30,.06),0_10px_20px_-10px_oklch(0.6_0.17_28/.5)] md:size-12">
        <span className="absolute inset-0 animate-ping-soft rounded-full bg-error/15" />
        <span className="size-3 rounded bg-error md:size-4 md:rounded-[5px]" />
      </span>
      <Waveform progress={0.62} live className="h-8 md:h-10" />
      <span className="font-mono text-[11px] text-ink-2 md:text-xs">00:36</span>
    </div>
  );
}

const CARDS: readonly { skill: Skill; wide: boolean; Demo: () => ReactNode }[] = [
  { skill: 'listening', wide: true, Demo: ListeningDemo },
  { skill: 'reading', wide: false, Demo: ReadingDemo },
  { skill: 'writing', wide: false, Demo: WritingDemo },
  { skill: 'speaking', wide: true, Demo: SpeakingDemo },
];

export function FormatSection() {
  const t = useTranslations('landing.format');
  return (
    <Container id="format" className="flex scroll-mt-24 flex-col gap-[18px] pt-16 md:gap-14 md:pt-36 md:pb-36">
      <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
        <SectionHeading eyebrow={t('eyebrow')} title={t.rich('title', richTags)} className="max-w-[600px]" />
        <Reveal as="p" delay={0.1} className="m-0 max-w-[380px] text-base leading-[1.6] text-ink-2 max-md:hidden">{t('text')}</Reveal>
      </div>
      <Stagger step={0.1} className="flex flex-col gap-[18px] md:flex-row md:flex-wrap md:gap-4">
        {CARDS.map(({ skill, wide, Demo }) => (
          <FormatCard key={skill} skill={skill} wide={wide}><Demo /></FormatCard>
        ))}
      </Stagger>
    </Container>
  );
}
