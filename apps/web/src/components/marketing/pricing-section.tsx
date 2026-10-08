import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { PLANS, RECOMMENDED_PLAN, type PlanInfo } from '@/lib/mock/plans';
import { formatSum } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { ButtonLink } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { FeatureList } from '@/components/ui/feature-list';
import { SectionHeading } from '@/components/ui/typography';
import { CountUp } from '@/components/motion/count-up';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { Spotlight } from '@/components/motion/spotlight';
import { Container } from './container';

function PlanCard({ plan, highlighted }: { plan: PlanInfo; highlighted: boolean }) {
  const t = useTranslations('plans');
  const tl = useTranslations('landing.pricing');
  const sub = plan.perMonth ? t('perMonth', { price: formatSum(plan.perMonth) }) : t('everyMonth');
  const Surface = highlighted ? 'div' : Spotlight;

  return (
    <StaggerItem className={cn('relative flex', highlighted && 'max-md:order-first md:-my-3')}>
      {highlighted && (
        <span className="absolute -top-3 left-1/2 z-10 flex h-6 -translate-x-1/2 items-center gap-1.5 rounded-pill bg-action px-3 text-[11px] font-medium whitespace-nowrap text-white shadow-action-sm">
          <Icon as={Sparkles} size={12} strokeWidth={2} />
          {tl('popular')}
        </span>
      )}
      <Surface
        className={cn(
          'flex w-full flex-col gap-[18px] rounded-card p-[22px] transition-[box-shadow,translate] duration-(--t-slow) ease-out-expo hover:-translate-y-1 md:gap-7 md:rounded-card-lg md:p-8',
          highlighted
            ? 'border-beam bg-surface shadow-[0_0_0_1px_oklch(0.55_0.15_140/.35),0_30px_60px_-30px_oklch(0.45_0.14_140/.45)] [--beam-width:2px] md:py-11'
            : 'bg-surface shadow-e0 hover:shadow-e2 md:bg-bg',
        )}
      >
        <div className="flex min-h-[26px] items-center justify-between">
          <span className="text-[15px] font-medium">{t(`${plan.id}.name`)}</span>
          {plan.discount && <Tag className="md:h-[26px] md:rounded-pill md:px-2.5">−{plan.discount}%</Tag>}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[38px] leading-none font-light tracking-[-0.055em] md:text-5xl">
              <CountUp value={plan.price} grouped duration={1.4} />
            </span>
            <span className="text-[13px] text-ink-2 md:text-sm">
              {t('currency')}<span className="md:hidden"> · {t(`${plan.id}.period`)}</span>
            </span>
          </div>
          <span className="text-[13px] text-ink-2 max-md:hidden">{sub}</span>
        </div>
        <ButtonLink
          href={ROUTES.start}
          variant={highlighted ? 'primary' : 'secondary'}
          size="md"
          arrow
          className={cn('h-12 rounded-[14px] text-[15px] md:order-none', highlighted ? 'max-md:order-last' : 'max-md:hidden')}
        >
          {t(highlighted ? 'choose' : 'start')}
        </ButtonLink>
        <FeatureList
          items={plan.features.map((f) => t(`features.${f}`))}
          className={cn('pt-4 shadow-[0_-1px_0_var(--track)] max-md:gap-2.5 md:pt-6 md:shadow-[0_-1px_0_var(--divider-muted)]', !highlighted && 'max-md:hidden')}
        />
      </Surface>
    </StaggerItem>
  );
}

export function PricingSection() {
  const t = useTranslations('landing.pricing');
  return (
    <section id="pricing" className="relative scroll-mt-24 overflow-hidden md:bg-surface md:shadow-[0_-1px_0_rgba(20,22,30,.06),0_1px_0_rgba(20,22,30,.06)]">
      <div className="grid-backdrop pointer-events-none absolute inset-0 bg-size-[56px_56px] mask-[radial-gradient(ellipse_50%_40%_at_50%_0%,#000,transparent_80%)] max-md:hidden" />
      <Container className="relative flex flex-col gap-[14px] pt-16 md:gap-16 md:py-36">
        <div className="flex flex-col gap-2.5 pb-1.5 md:items-center md:gap-4 md:pb-0 md:text-center">
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} align="center" className="max-md:items-start max-md:text-left" />
          <Reveal as="span" delay={0.1} className="text-sm text-ink-2 md:text-[15px]">{t('text')}</Reveal>
        </div>
        <Stagger step={0.12} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-[14px] pt-3 md:gap-4">
          {PLANS.map((plan) => <PlanCard key={plan.id} plan={plan} highlighted={plan.id === RECOMMENDED_PLAN} />)}
        </Stagger>
      </Container>
    </section>
  );
}
