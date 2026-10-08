'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Check, Pause, Play } from 'lucide-react';
import {
  formatClock,
  levelFor,
  recordingUrl,
  useAiReviewRequest,
  useCefrClient,
  useSpeakingReview,
  weakestLabel,
  type Criterion,
  type ReviewLocale,
  type SpeakingAnswer,
  type SpeakingReview as SpeakingReviewData,
} from '@cefr/core';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { panelSurface } from '@/components/dashboard/panel';
import { AiPendingCard, MarkedText, ResultsTopbar, SkeletonBlocks, StatePanel } from './shared';

function CriteriaTiles({ criteria }: { criteria: Criterion[] }) {
  const weakest = weakestLabel(criteria);
  return (
    <div className="stagger grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {criteria.map((c) => (
        <div key={c.label} className={cn(panelSurface, 'flex flex-col gap-2.5 p-4')}>
          <span className="text-[13px] text-ink-2">{c.label}</span>
          <span className="text-[30px] leading-none font-light tracking-[-0.05em]">
            {c.score}
            <span className="ml-1 font-mono text-[11px] tracking-normal text-ink-3">/{c.max}</span>
          </span>
          <ProgressBar value={c.score} max={c.max} size="xs" tone={c.label === weakest ? 'warning' : 'blue'} />
        </div>
      ))}
    </div>
  );
}

function TipList({ tips }: { tips: SpeakingReviewData['tips'] }) {
  return (
    <div className={cn(panelSurface, 'flex flex-col gap-2.5 px-5 py-4')}>
      {tips.map((tip) => (
        <div key={tip.text} className="flex items-start gap-2.5">
          <span className={cn('grid size-[22px] shrink-0 place-items-center rounded-full text-xs font-semibold', tip.tone === 'good' ? 'bg-success-50 text-success' : 'bg-warning-50 text-warning-text')}>
            {tip.tone === 'good' ? <Icon as={Check} size={12} strokeWidth={2.5} /> : '!'}
          </span>
          <span className="text-sm leading-normal text-ink-body">{tip.text}</span>
        </div>
      ))}
    </div>
  );
}

function RecordingPlayer({ path, durationSec }: { path: string; durationSec: number }) {
  const t = useTranslations('exam.aiReview');
  const client = useCefrClient();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const url = useQuery({ queryKey: ['recording', path], queryFn: () => recordingUrl(client, path), staleTime: 50 * 60_000 });

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => undefined);
    else audio.pause();
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-muted px-3 py-2.5">
      {url.data && (
        <audio
          ref={audioRef}
          src={url.data}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
        />
      )}
      <button type="button" disabled={!url.data} onClick={toggle} aria-label={t(playing ? 'pause' : 'play')} className="grid size-9 shrink-0 place-items-center rounded-full bg-action text-white shadow-action-sm transition-[scale] hover:scale-105 disabled:opacity-40">
        <Icon as={playing ? Pause : Play} size={13} fill="currentColor" strokeWidth={0} />
      </button>
      <div className="relative h-1 flex-1 overflow-hidden rounded-[2px] bg-divider-page">
        <span className="absolute inset-y-0 left-0 rounded-[2px] bg-blue" style={{ width: `${durationSec ? Math.min(100, (position / durationSec) * 100) : 0}%` }} />
      </div>
      <span className="font-mono text-xs text-ink-2">{formatClock(position)} / {formatClock(durationSec)}</span>
    </div>
  );
}

function AnswerCard({ answer }: { answer: SpeakingAnswer }) {
  const t = useTranslations('exam.aiReview');
  const [sampleOpen, setSampleOpen] = useState(false);
  return (
    <div className={cn(panelSurface, 'flex flex-col gap-3.5 p-5')}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{answer.part}</span>
        <span className="font-mono text-xs text-ink-3">{t('transcriptMeta', { words: answer.words, wpm: answer.wpm })}</span>
      </div>
      <span className="text-[13px] leading-normal text-ink-2">{answer.prompt}</span>
      <RecordingPlayer path={answer.path} durationSec={answer.durationSec} />
      <MarkedText segments={answer.segments} grammarTone="warning" />
      {answer.sample && (
        <div className="flex flex-col gap-2 pt-1">
          <button type="button" onClick={() => setSampleOpen((open) => !open)} aria-expanded={sampleOpen} className="w-fit text-[13px] font-medium text-green-text hover:text-green-hover">
            {t(sampleOpen ? 'sampleHide' : 'sampleShow')}
          </button>
          {sampleOpen && <p className="m-0 animate-fade-up rounded-2xl bg-green-50 px-4 py-3 text-[15px] leading-relaxed text-ink-reading">{answer.sample}</p>}
        </div>
      )}
    </div>
  );
}

export function SpeakingReview({ id }: { id: string }) {
  const t = useTranslations('exam');
  const locale = useLocale() as ReviewLocale;
  const query = useSpeakingReview(id);
  const { request } = useAiReviewRequest(id, query.data?.status, locale);
  const review = query.data?.status === 'ready' ? query.data.review : null;

  const body = () => {
    if (query.isError || query.data?.status === 'failed') {
      return (
        <StatePanel
          title={t('common.error')}
          message={t(query.isError ? 'aiReview.loadFailed' : 'aiReview.failedMessage')}
          action={t('common.retry')}
          onAction={() => (query.isError ? query.refetch() : request().catch(() => undefined))}
        />
      );
    }
    if (!review) {
      return (
        <>
          {query.data && <AiPendingCard />}
          <SkeletonBlocks count={3} />
        </>
      );
    }
    if (review.answers.length === 0) return <StatePanel title={t('aiReview.speakingTitle')} message={t('aiReview.noRecordings')} />;
    return (
      <>
        <CriteriaTiles criteria={review.criteria} />
        {review.tips.length > 0 && <TipList tips={review.tips} />}
        <span className="pt-1 text-sm font-medium">{t('aiReview.answers')}</span>
        <div className="grid gap-3 xl:grid-cols-2">
          {review.answers.map((answer) => <AnswerCard key={answer.questionId} answer={answer} />)}
        </div>
      </>
    );
  };

  return (
    <>
      <ResultsTopbar back={ROUTES.result(id)} title={t('aiReview.speakingTitle')} meta={review ? `${review.score} · ${levelFor(review.score)}` : undefined} />
      {body()}
    </>
  );
}
