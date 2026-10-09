'use client';

import { useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MAX_SCORE, useAiReviewRequest, useWritingReview, type Correction, type ReviewLocale, type TextSegment } from '@cefr/core';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { panelSurface } from '@/components/dashboard/panel';
import { AiPendingCard, CriteriaBars, CriteriaBarsSkeleton, MarkedText, ResultsTopbar, StatePanel } from './shared';

const LAYOUT = 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]';
const SKELETON_CRITERIA = 4;
const SKELETON_ESSAY = ['w-full', 'w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-full', 'w-2/3'];

function ErrorsPanel({ children }: { children: ReactNode }) {
  const t = useTranslations('exam.aiReview');
  return (
    <div className={cn(panelSurface, 'flex flex-col gap-4 p-6')}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium">{t('errorsInText')}</span>
        <span className="flex gap-3.5 text-xs text-ink-2">
          <span className="flex items-center gap-1.5"><span className="h-[3px] w-3 rounded-[2px] bg-error" />{t('grammar')}</span>
          <span className="flex items-center gap-1.5"><span className="h-[3px] w-3 rounded-[2px] bg-warning" />{t('lexis')}</span>
        </span>
      </div>
      {children}
    </div>
  );
}

function ScoreHero({ score, children }: { score: ReactNode; children: ReactNode }) {
  return (
    <div className="relative isolate flex items-center gap-5 overflow-hidden rounded-card-sm bg-hero px-6 py-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18)]">
      <span aria-hidden className="pointer-events-none absolute -top-1/2 -right-1/4 -z-10 size-64 animate-aurora rounded-full bg-[oklch(0.7_0.14_200/.45)] blur-[70px]" />
      <span className="flex items-baseline gap-1">
        {score}
        <span className="font-mono text-[13px] text-white/60">/{MAX_SCORE}</span>
      </span>
      <span className="flex flex-col gap-1 text-[13px] leading-snug text-white/85">{children}</span>
    </div>
  );
}

function ErrorsCard({ segments, corrections }: { segments: TextSegment[]; corrections: Correction[] }) {
  const [active, setActive] = useState(corrections[0]?.from);
  const correction = corrections.find((c) => c.from === active);

  return (
    <ErrorsPanel>
      <MarkedText segments={segments} active={active} onMark={setActive} />
      {correction && (
        <div key={correction.from} className="flex animate-fade-up flex-col gap-1.5 rounded-2xl bg-surface-muted px-4 py-3.5">
          <span className="flex flex-wrap items-center gap-2 font-mono text-sm">
            <span className="text-error-text line-through">{correction.from}</span>
            <Icon as={ArrowRight} size={13} className="text-ink-3" />
            <span className="font-medium text-success">{correction.to}</span>
          </span>
          <span className="text-[13px] leading-normal text-ink-2">{correction.note}</span>
        </div>
      )}
    </ErrorsPanel>
  );
}

function WritingReviewSkeleton() {
  const t = useTranslations('exam.aiReview');
  return (
    <div className={LAYOUT}>
      <ErrorsPanel>
        <div className="flex flex-col text-[16px] leading-[1.85]">
          {SKELETON_ESSAY.map((width, line) => <SkeletonText key={line} className={width} />)}
        </div>
        <Skeleton className="h-[74px] rounded-2xl" />
      </ErrorsPanel>
      <div className="flex flex-col gap-3">
        <ScoreHero score={<Skeleton tone="inverse" className="h-[43px] w-14" />}>
          <SkeletonText tone="inverse" className="w-10 text-[15px]" />
          <SkeletonText tone="inverse" className="w-40" />
        </ScoreHero>
        <span className="pt-1 text-[13px] font-medium text-ink-2">{t('criteriaTitle')}</span>
        <CriteriaBarsSkeleton rows={SKELETON_CRITERIA} />
        <Skeleton className="h-11 w-full rounded-[13px]" />
      </div>
    </div>
  );
}

export function WritingReview({ id }: { id: string }) {
  const t = useTranslations('exam');
  const locale = useLocale() as ReviewLocale;
  const query = useWritingReview(id);
  const { request } = useAiReviewRequest(id, query.data?.status, locale);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [improvedOpen, setImprovedOpen] = useState(false);
  const review = query.data?.status === 'ready' ? query.data.review : null;
  const tasks = review?.tasks ?? [];
  const task = tasks.find((item) => item.taskId === taskId) ?? tasks[tasks.length - 1];
  const answered = task !== undefined && task.words > 0;
  const failed = query.isError || query.data?.status === 'failed';

  const meta = () => {
    if (task) return t('aiReview.writingMeta', { task: task.label, count: task.words });
    return !failed && <SkeletonText className="w-36" />;
  };

  const body = () => {
    if (failed) {
      return (
        <StatePanel
          title={t('common.error')}
          message={t(query.isError ? 'aiReview.loadFailed' : 'aiReview.failedMessage')}
          action={t('common.retry')}
          onAction={() => (query.isError ? query.refetch() : request().catch(() => undefined))}
        />
      );
    }
    if (!review || !task) {
      return (
        <>
          {query.data && <AiPendingCard />}
          <WritingReviewSkeleton />
        </>
      );
    }
    if (!answered) return <StatePanel title={task.label} message={t('aiReview.noAnswer')} />;
    return (
      <div className={LAYOUT}>
        <ErrorsCard key={task.taskId} segments={task.segments} corrections={task.corrections} />
        <div className="flex flex-col gap-3">
          <ScoreHero score={<span className="text-[48px] leading-[.9] font-light tracking-[-0.06em]">{task.score}</span>}>
            <span className="text-[15px] font-medium text-white">{task.level}</span>
            {task.summary}
          </ScoreHero>
          <span className="pt-1 text-[13px] font-medium text-ink-2">{t('aiReview.criteriaTitle')}</span>
          <CriteriaBars criteria={task.criteria} />
          <Button arrow block size="md" icon={<Icon as={Sparkles} size={15} />} onClick={() => setImprovedOpen(true)}>{t('aiReview.showImproved')}</Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <ResultsTopbar
        back={ROUTES.result(id)}
        title={t('aiReview.writingTitle')}
        meta={meta()}
        actions={
          tasks.length > 1 && (
            <div role="tablist" className="flex h-9 rounded-[11px] bg-seg-track p-[3px] text-[13px]">
              {tasks.map((item) => (
                <button key={item.taskId} type="button" role="tab" aria-selected={item.taskId === task?.taskId} onClick={() => setTaskId(item.taskId)} className={cn('rounded-[8px] px-4 transition-colors', item.taskId === task?.taskId ? 'bg-surface font-medium text-ink shadow-[0_1px_2px_rgba(20,22,30,.08)]' : 'text-ink-2 hover:text-ink')}>
                  {item.label}
                </button>
              ))}
            </div>
          )
        }
      />
      {body()}
      <Dialog open={improvedOpen} onOpenChange={setImprovedOpen}>
        <DialogContent title={t('aiReview.improvedTitle')} description={t('aiReview.improvedSubtitle')} closeLabel={t('common.close')}>
          <p className="m-0 max-h-[50dvh] overflow-y-auto rounded-2xl bg-surface-muted px-5 py-4 text-[15px] leading-[1.8] whitespace-pre-line text-ink-reading">{task?.improved}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
