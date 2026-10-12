import { useTranslations } from 'next-intl';
import { useAppLinks } from '@/lib/app-links';
import { cn } from '@cefr/ui/lib/cn';
import { ButtonLink } from '@cefr/ui/components/button';
import { buttonVariants } from '@cefr/ui/components/button-variants';
import { Reveal } from '@cefr/ui/motion/reveal';
import { Container } from './container';
import { CTA_ORBS } from '@/constants/sections';

export function CtaBanner() {
  const t = useTranslations('landing.cta');
  const app = useAppLinks();
  return (
    <Container id="download" className="scroll-mt-24 pt-12 md:pt-0 md:pb-30">
      <Reveal className="relative isolate flex flex-col gap-5 overflow-hidden rounded-card-lg bg-hero px-[22px] py-7 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_40px_80px_-40px_oklch(0.4_0.095_263/.6)] md:gap-8 md:rounded-banner md:p-[clamp(40px,6vw,80px)]">
        {CTA_ORBS.map((o) => (
          <span key={o.className} aria-hidden className={cn('pointer-events-none absolute -z-10 animate-aurora rounded-full blur-[100px]', o.className)} style={{ animationDuration: o.duration }} />
        ))}
        <div className="grid-backdrop-light pointer-events-none absolute inset-0 -z-10 bg-size-[56px_56px] mask-[radial-gradient(ellipse_60%_80%_at_100%_0%,#000,transparent_70%)] max-md:hidden" />
        <h2 className="m-0 max-w-[760px] text-[32px] leading-[1.02] font-medium tracking-[-0.045em] md:text-[clamp(36px,5vw,68px)] md:leading-none md:tracking-[-0.05em]">
          {t('title')}
        </h2>
        <span className="text-sm text-white/75 md:hidden">{t('noteShort')}</span>
        <div className="flex flex-wrap items-center gap-2.5">
          <ButtonLink href={app.start} variant="onDark" arrow className="max-md:w-full md:min-w-[220px]">{t('start')}</ButtonLink>
          <a href="#" className={cn(buttonVariants({ variant: 'glass' }), 'px-[18px] max-md:hidden')}>{t('stores')}</a>
          <span className="ml-2 text-sm text-white/72 max-md:hidden">{t('note')}</span>
        </div>
      </Reveal>
    </Container>
  );
}
