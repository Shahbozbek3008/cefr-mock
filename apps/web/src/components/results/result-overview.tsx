'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Check, Mic, PenLine, Share2 } from 'lucide-react';
import {
  MAX_SCORE,
  isAiActive,
  levelFor,
  levelNames,
  useAiReviewRequest,
  useResult,
  type AiReviewKind,
  type ReviewLocale,
  type SectionKind,
  type SectionScore,
} from '@cefr/core';
import { Link } from '@/i18n/navigation';
import { ROUTES, SKILLS, SKILL_ICONS } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { failureKey } from '@/lib/exam/session';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { Button, ButtonLink } from '@/components/ui/button';
import { Gauge, ScoreValue } from '@/components/ui/gauge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { CountUp } from '@/components/motion/count-up';
import { ScaleBar, LEVEL_LABELS } from '@/components/app/scale-bar';
import { Delta } from '@/components/app/delta';
import { panelSurface } from '@/components/dashboard/panel';
import { Trend } from '@/components/dashboard/trend';
import { LinkRow, LinkRowSkeleton, ResultsTopbar, StatePanel } from './shared';

const AI_KINDS: SectionKind[] = ['writing', 'speaking'];
const SUMMARY_GRID = 'grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]';
const GAUGE_PANEL = 'flex flex-col items-center gap-3.5 p-6';
const SECTION_CARD = 'flex flex-col gap-3.5 p-5';
const RECOMMENDATION = 'flex flex-col gap-1 rounded-card-sm bg-blue-50 px-5 py-4';
const TOPBAR_BUTTON = 'h-10 rounded-[13px]';

const sectionHref = (id: string, kind: SectionKind) =>
  kind === 'writing' ? ROUTES.aiWriting(id) : kind === 'speaking' ? ROUTES.aiSpeaking(id) : `${ROUTES.review(id)}?tab=${kind}`;

function SectionCard({ id, section, pending }: { id: string; section: SectionScore; pending: boolean }) {
  const t = useTranslations('exam');
  return (
    <Link
      href={sectionHref(id, section.kind)}
      className={cn(panelSurface, SECTION_CARD, 'group text-ink transition-[box-shadow,translate] duration-(--t-sheet) ease-out-expo hover:-translate-y-0.5 hover:text-ink hover:shadow-e1')}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2.5 text-sm text-ink-body">
          <Icon as={SKILL_ICONS[section.kind]} size={16} strokeWidth={1.6} className="text-ink-2" />
          {section.title}
        </span>
        {pending ? (
          <Tag tone="blue" size="sm" className="animate-pulse">{t('aiReview.checkingShort')}</Tag>
        ) : section.focus ? (
          <Tag tone="warning" size="sm">{t('result.focus')}</Tag>
        ) : (
          <Delta value={section.delta} />
        )}
      </div>
      <span className="text-[36px] leading-none font-light tracking-[-0.05em]">
        <CountUp value={section.score} />
        <span className="ml-1 font-mono text-xs tracking-normal text-ink-3">/{MAX_SCORE}</span>
      </span>
      <ProgressBar value={section.score} max={MAX_SCORE} tone={section.focus ? 'warning' : 'blue'} />
      <span className="flex items-center gap-1 text-[13px] font-medium text-green-text">
        {t('result.details')}
        <Icon as={ArrowRight} size={13} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function SectionCardSkeleton() {
  return (
    <div className={cn(panelSurface, SECTION_CARD)}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2.5 text-sm">
          <Skeleton className="size-4 rounded-[4px]" />
          <SkeletonText className="w-20" />
        </span>
        <SkeletonText className="w-8 text-xs" />
      </div>
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-1 w-full rounded-[2px]" />
      <SkeletonText className="w-24 text-[13px]" />
    </div>
  );
}

function ResultOverviewSkeleton() {
  const t = useTranslations('exam');
  return (
    <>
      <ResultsTopbar
        back={ROUTES.catalog}
        title={<SkeletonText className="w-56" />}
        meta={<SkeletonText className="w-36" />}
        actions={
          <>
            <Skeleton className={cn(TOPBAR_BUTTON, 'w-28')} />
            <Skeleton className={cn(TOPBAR_BUTTON, 'w-32')} />
          </>
        }
      />
      <div className={SUMMARY_GRID}>
        <div className={cn(panelSurface, GAUGE_PANEL)}>
          <Gauge value={0} max={MAX_SCORE} size={200} stroke={12} labelOffset={20}>
            <Skeleton className="h-[54px] w-24" />
            <span className="font-mono text-xs text-ink-3">/ {MAX_SCORE}</span>
          </Gauge>
          <Skeleton className="h-7 w-36 rounded-chip" />
          <div className="w-full pt-3">
            <ScaleBar value={0} variant="light" labels={LEVEL_LABELS} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {SKILLS.map((skill) => <SectionCardSkeleton key={skill} />)}
          </div>
          <div className={RECOMMENDATION}>
            <SkeletonText className="w-3/5 text-[15px]" />
            <SkeletonText className="w-2/5 text-[13px]" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">{t('result.aiScore')}</span>
        <div className="grid gap-3 sm:grid-cols-2">
          {AI_KINDS.map((kind) => <LinkRowSkeleton key={kind} />)}
        </div>
      </div>
    </>
  );
}

export function ResultOverview({ id }: { id: string }) {
  const t = useTranslations('exam');
  const locale = useLocale() as ReviewLocale;
  const result = useResult(id);
  const [shared, setShared] = useState(false);
  const data = result.data;
  const aiPending = Object.values(data?.aiStatus ?? {}).includes('pending');
  useAiReviewRequest(id, aiPending ? 'pending' : undefined, locale);

  if (result.isError) {
    return <StatePanel title={t('result.notFound')} message={t(`common.${failureKey(result.error)}`)} action={t('common.retry')} onAction={() => result.refetch()} />;
  }
  if (!data) return <ResultOverviewSkeleton />;

  const level = levelFor(data.total);
  const full = data.scope === 'full';
  const aiKinds = AI_KINDS.filter((kind) => data.sections.some((s) => s.kind === kind));

  const share = async () => {
    const message = t('result.shareMessage', { title: data.title, score: data.total, max: MAX_SCORE, level });
    if (navigator.share) {
      await navigator.share({ text: message }).catch(() => undefined);
      return;
    }
    await navigator.clipboard?.writeText(message);
    setShared(true);
  };

  return (
    <>
      <ResultsTopbar
        back={ROUTES.catalog}
        title={data.title}
        meta={`${data.dateLabel} · ${data.durationLabel}`}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<Icon as={shared ? Check : Share2} size={15} />} onClick={share}>{t('common.share')}</Button>
            {data.sections.some((s) => s.kind === 'listening' || s.kind === 'reading') && (
              <ButtonLink href={ROUTES.review(id)} size="sm" arrow>{t('result.details')}</ButtonLink>
            )}
          </>
        }
      />
      <div className={SUMMARY_GRID}>
        <div className={cn(panelSurface, GAUGE_PANEL)}>
          <Gauge value={data.total} max={MAX_SCORE} size={200} stroke={12} labelOffset={20}>
            <ScoreValue value={data.total} max={MAX_SCORE} size={60} />
          </Gauge>
          <div className="flex items-center gap-2">
            <Tag size="lg">{level} · {levelNames[level]}</Tag>
            {full && data.delta !== 0 && <Trend value={data.delta} />}
          </div>
          {full && (
            <div className="w-full pt-3">
              <ScaleBar value={data.total} variant="light" labels={LEVEL_LABELS} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <div className={cn('stagger grid gap-3', data.sections.length > 1 && 'sm:grid-cols-2')}>
            {data.sections.map((section) => (
              <SectionCard key={section.kind} id={id} section={section} pending={isAiActive(data.aiStatus[section.kind as AiReviewKind])} />
            ))}
          </div>
          {full && (
            <div className={RECOMMENDATION}>
              <span className="text-[15px] font-medium text-blue-text">
                {data.recommendation.level ? t('result.toLevel', { level: data.recommendation.level, points: data.recommendation.points }) : t('result.topLevel')}
              </span>
              <span className="text-[13px] text-ink-2">{t('result.growthPoint', { focus: data.recommendation.focus })}</span>
            </div>
          )}
        </div>
      </div>
      {aiKinds.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium">{t('result.aiScore')}</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {aiKinds.includes('writing') && <LinkRow href={ROUTES.aiWriting(id)} icon={<Icon as={PenLine} size={17} />} title={t('result.writingReview')} detail={isAiActive(data.aiStatus.writing) ? t('aiReview.checkingShort') : undefined} />}
            {aiKinds.includes('speaking') && <LinkRow href={ROUTES.aiSpeaking(id)} icon={<Icon as={Mic} size={17} />} title={t('result.speakingReview')} detail={isAiActive(data.aiStatus.speaking) ? t('aiReview.checkingShort') : undefined} />}
          </div>
        </div>
      )}
    </>
  );
}
