import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { Icon } from '@/components/ui/icon';
import { panelSurface } from './panel';

export function InsightCard() {
  const t = useTranslations('dashboard.insight');
  return (
    <section className={`${panelSurface} relative isolate flex flex-1 flex-col gap-3 overflow-hidden p-5`}>
      <span aria-hidden className="pointer-events-none absolute -right-16 -bottom-20 -z-10 size-56 rounded-full bg-[radial-gradient(closest-side,oklch(0.93_0.05_258/.9),transparent)]" />
      <span className="flex items-center gap-1.5 text-xs font-medium text-blue-text">
        <Icon as={Sparkles} size={13} strokeWidth={1.9} />
        {t('label')}
      </span>
      <span className="text-[15px] leading-snug font-medium tracking-[-0.015em]">{t('title')}</span>
      <p className="m-0 text-[13px] leading-normal text-ink-2">{t('text')}</p>
      <Link href={ROUTES.testSection('13', 'writing')} className="group mt-auto flex w-fit items-center gap-1.5 pt-1 text-[13px] font-medium text-blue-text hover:text-blue">
        {t('cta')}
        <Icon as={ArrowRight} size={14} strokeWidth={1.8} className="transition-transform duration-(--t-base) group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
