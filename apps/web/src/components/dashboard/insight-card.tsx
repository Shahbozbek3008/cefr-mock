import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { TestResult } from '@cefr/core';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { Icon } from '@/components/ui/icon';
import { SkeletonText } from '@/components/ui/skeleton';
import { panelSurface } from './panel';

function InsightShell({ children }: { children: ReactNode }) {
  const t = useTranslations('dashboard.insight');
  return (
    <section className={`${panelSurface} relative isolate flex flex-1 flex-col gap-3 overflow-hidden p-5`}>
      <span aria-hidden className="pointer-events-none absolute -right-16 -bottom-20 -z-10 size-56 rounded-full bg-[radial-gradient(closest-side,oklch(0.93_0.05_258/.9),transparent)]" />
      <span className="flex items-center gap-1.5 text-xs font-medium text-blue-text">
        <Icon as={Sparkles} size={13} strokeWidth={1.9} />
        {t('label')}
      </span>
      {children}
    </section>
  );
}

export function InsightCardSkeleton() {
  return (
    <InsightShell>
      <SkeletonText className="w-4/5 text-[15px] leading-snug" />
      <div className="flex flex-col text-[13px] leading-normal">
        <SkeletonText className="w-full" />
        <SkeletonText className="w-3/5" />
      </div>
      <div className="mt-auto pt-1">
        <SkeletonText className="w-24 text-[13px]" />
      </div>
    </InsightShell>
  );
}

export function InsightCard({ latest }: { latest?: TestResult }) {
  const t = useTranslations('dashboard.insight');
  const tr = useTranslations('exam.result');
  const recommendation = latest?.recommendation;

  return (
    <InsightShell>
      <span className="text-[15px] leading-snug font-medium tracking-[-0.015em]">
        {!recommendation ? t('empty') : recommendation.level ? tr('toLevel', { level: recommendation.level, points: recommendation.points }) : tr('topLevel')}
      </span>
      <p className="m-0 text-[13px] leading-normal text-ink-2">
        {recommendation ? tr('growthPoint', { focus: recommendation.focus }) : t('emptyText')}
      </p>
      <Link href={latest ? ROUTES.result(latest.id) : ROUTES.catalog} className="group mt-auto flex w-fit items-center gap-1.5 pt-1 text-[13px] font-medium text-blue-text hover:text-blue">
        {latest ? t('cta') : t('emptyCta')}
        <Icon as={ArrowRight} size={14} strokeWidth={1.8} className="transition-transform duration-(--t-base) group-hover:translate-x-0.5" />
      </Link>
    </InsightShell>
  );
}
