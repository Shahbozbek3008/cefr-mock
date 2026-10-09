import { useTranslations } from 'next-intl';
import { Clock3, Layers } from 'lucide-react';
import { formatClock, sectionTitles, type TestSummary } from '@cefr/core';
import { ROUTES } from '@/lib/constants';
import { Icon } from '@/components/ui/icon';
import { Ring } from '@/components/ui/gauge';
import { ButtonLink } from '@/components/ui/button';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { CountUp } from '@/components/motion/count-up';
import { Panel } from './panel';

export function ContinueCardSkeleton() {
  return (
    <Panel className="gap-4 p-5">
      <SkeletonText className="w-28 text-[13px]" />
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <SkeletonText className="w-40 text-[17px]" />
          <SkeletonText className="w-28 text-[13px] leading-snug" />
        </div>
      </div>
      <Skeleton className="h-9 w-full rounded-[10px]" />
    </Panel>
  );
}

export function ContinueCard({ test }: { test?: TestSummary }) {
  const t = useTranslations('dashboard.continue');

  if (!test) {
    return (
      <Panel className="gap-3 p-5">
        <span className="grid size-10 place-items-center rounded-[11px] bg-surface-sunken text-ink-2"><Icon as={Layers} size={18} strokeWidth={1.7} /></span>
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-medium tracking-[-0.015em]">{t('empty')}</span>
          <span className="text-[13px] leading-normal text-ink-2">{t('emptyText')}</span>
        </div>
        <ButtonLink href={ROUTES.catalog} size="xs" arrow block className="mt-1 h-9 rounded-[10px] text-[13px]">{t('emptyCta')}</ButtonLink>
      </Panel>
    );
  }

  const percent = Math.round((test.progress ?? 0) * 100);
  const section = test.resumeSection ?? 'listening';

  return (
    <Panel className="gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-ink-2">{t('label')}</span>
        {test.resumeRemainingSec !== undefined && (
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-2">
            <Icon as={Clock3} size={12} strokeWidth={1.8} />
            {t('left', { time: formatClock(test.resumeRemainingSec) })}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Ring value={percent} max={100} size={64} stroke={6} r={26}>
          <span className="font-mono text-[13px] font-medium"><CountUp value={percent} />%</span>
        </Ring>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[17px] font-medium tracking-[-0.02em]">{test.title}</span>
          <span className="text-[13px] leading-snug text-ink-2">
            {sectionTitles[section]} · {test.resumeAnswered ?? 0}/{test.resumeTotal ?? 0}
          </span>
        </div>
      </div>
      <ButtonLink href={ROUTES.testSection(test.id, section)} size="xs" arrow block className="h-9 rounded-[10px] text-[13px]">
        {t('cta')}
      </ButtonLink>
    </Panel>
  );
}
