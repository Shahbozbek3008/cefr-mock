import { useTranslations } from 'next-intl';
import { richTags } from '@cefr/ui/lib/rich';
import { Icon } from '@cefr/ui/components/icon';
import { SectionHeading } from '@cefr/ui/components/typography';
import { Grow } from '@cefr/ui/motion/grow';
import { Stagger, StaggerItem } from '@cefr/ui/motion/reveal';
import { Spotlight } from '@cefr/ui/motion/spotlight';
import { Container } from './container';
import { STEPS } from '@/constants/sections';
import { STEP_DELAY } from '@/constants/ui';

export function StepsSection() {
  const t = useTranslations('landing.steps');
  return (
    <Container id="steps" className="flex scroll-mt-24 flex-col gap-10 py-20 md:gap-16 md:py-36">
      <SectionHeading eyebrow={t('eyebrow')} title={t.rich('title', richTags)} className="max-w-[640px]" />
      <Stagger as="ol" step={STEP_DELAY} className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-4 gap-y-4 p-0">
        {STEPS.map((step, i) => (
          <StaggerItem as="li" key={step.key} className="flex flex-col gap-5">
            <div className="flex items-center gap-3 max-md:hidden">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface font-mono text-xs text-green-eyebrow shadow-[0_0_0_1px_rgb(var(--line-rgb)/.08)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="h-0.5 flex-1 overflow-hidden rounded-[1px] bg-divider-page">
                <Grow width="100%" delay={0.3 + i * STEP_DELAY} className="h-full bg-[linear-gradient(90deg,var(--green-500),var(--green-300))]" />
              </span>
            </div>
            <Spotlight className="group flex h-full flex-col gap-4 rounded-card bg-surface p-6 shadow-e0 transition-[box-shadow,translate] duration-(--t-slow) ease-out-expo hover:-translate-y-1 hover:shadow-e2 md:p-7">
              <span className="grid size-11 place-items-center rounded-[13px] bg-green-100 text-green-text transition-[scale,rotate] duration-(--t-sheet) ease-spring group-hover:scale-110 group-hover:rotate-[-6deg]">
                <Icon as={step.icon} size={20} />
              </span>
              <span className="flex items-center gap-2 text-xl font-medium tracking-[-0.025em]">
                <span className="font-mono text-[13px] text-ink-3 md:hidden">{String(i + 1).padStart(2, '0')}</span>
                {t(`items.${step.key}.title`)}
              </span>
              <span className="max-w-[320px] text-[15px] leading-[1.6] text-ink-2">{t(`items.${step.key}.desc`)}</span>
            </Spotlight>
          </StaggerItem>
        ))}
      </Stagger>
    </Container>
  );
}
