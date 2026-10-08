import { useTranslations } from 'next-intl';
import { ArrowRight, Quote } from 'lucide-react';
import { MAX_SCORE } from '@/lib/constants';
import { richTags } from '@/lib/rich';
import { Icon } from '@/components/ui/icon';
import { SectionHeading } from '@/components/ui/typography';
import { Marquee } from '@/components/motion/marquee';
import { Reveal } from '@/components/motion/reveal';

const TESTIMONIALS = [
  { key: 't1', from: 'B1', to: 'B2', score: 58, hue: 135 },
  { key: 't2', from: 'B1', to: 'B2', score: 55, hue: 258 },
  { key: 't3', from: 'B1', to: 'B2', score: 59, hue: 75 },
  { key: 't4', from: 'B2', to: 'C1', score: 66, hue: 190 },
  { key: 't5', from: 'B1', to: 'B2', score: 53, hue: 28 },
  { key: 't6', from: 'B2', to: 'C1', score: 68, hue: 300 },
] as const;

type Testimonial = (typeof TESTIMONIALS)[number];

const ROTATED = [...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3)];

function TestimonialCard({ item }: { item: Testimonial }) {
  const t = useTranslations('landing.testimonials.items');
  const name = t(`${item.key}.name`);
  return (
    <figure className="m-0 flex w-[320px] shrink-0 flex-col gap-5 rounded-card bg-surface p-6 shadow-e0 transition-[box-shadow,translate] duration-(--t-slow) ease-out-expo hover:-translate-y-1 hover:shadow-e2 md:w-[380px]">
      <div className="flex items-center justify-between">
        <Icon as={Quote} size={20} className="text-green-300" fill="currentColor" strokeWidth={0} />
        <span className="flex items-center gap-1.5 rounded-pill bg-green-50 px-2.5 py-1 font-mono text-[11px] text-green-text shadow-[inset_0_0_0_1px_var(--green-100)]">
          {item.from}
          <Icon as={ArrowRight} size={11} strokeWidth={2} />
          {item.to}
          <span className="text-ink-3">· {item.score}/{MAX_SCORE}</span>
        </span>
      </div>
      <blockquote className="m-0 flex-1 text-[15px] leading-[1.6] text-ink-body">{t(`${item.key}.quote`)}</blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          className="grid size-9 place-items-center rounded-full text-sm font-medium text-white"
          style={{ background: `linear-gradient(155deg, oklch(0.7 0.12 ${item.hue}), oklch(0.55 0.13 ${item.hue}))` }}
        >
          {name[0]}
        </span>
        <span className="flex flex-col leading-[1.3]">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-ink-2">{t(`${item.key}.city`)}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  const t = useTranslations('landing.testimonials');
  return (
    <section className="flex flex-col gap-10 overflow-hidden pb-20 md:gap-14 md:pb-36">
      <div className="mx-auto w-full max-w-page px-5 md:px-8">
        <SectionHeading eyebrow={t('eyebrow')} title={t.rich('title', richTags)} align="center" />
      </div>
      <Reveal delay={0.15} className="flex flex-col gap-2">
        <Marquee duration={60} className="py-2">
          {TESTIMONIALS.map((item) => <TestimonialCard key={item.key} item={item} />)}
        </Marquee>
        <Marquee duration={70} reverse className="py-2 max-md:hidden">
          {ROTATED.map((item) => <TestimonialCard key={item.key} item={item} />)}
        </Marquee>
      </Reveal>
    </section>
  );
}
