'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronsRight, Headphones, Lock, Mic, MicOff, MonitorX, RotateCcw, type LucideIcon } from 'lucide-react';
import { formatClock, useCefrClient, type SpeakingQuestion, type TestDetail } from '@cefr/core';
import { cn } from '@/lib/cn';
import { useAttemptStore } from '@/lib/attempt-store';
import { uploads, useSessionControls } from '@/lib/exam/session';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { TimerPill } from '@/components/test/timer-pill';
import { ExamHeader } from './exam-header';
import { SessionDialogs } from './session-dialogs';
import { useAnswerRecorder, type MicIssue, type RecorderPhase } from './use-answer-recorder';

const WAVE_BARS = 24;
const roundButton = 'grid size-12 place-items-center rounded-full bg-surface text-ink-body shadow-inset transition-[background-color,scale] duration-(--t-base) hover:bg-bg-app active:scale-95 disabled:opacity-40';

const ISSUE_ICONS: Record<MicIssue, LucideIcon> = { denied: MicOff, missing: Headphones, busy: Mic, unsupported: MonitorX };

const lockIcon = () => (
  <span className="inline-grid size-5 place-items-center rounded-[6px] bg-surface-sunken align-middle text-ink-2">
    <Icon as={Lock} size={11} strokeWidth={2} />
  </span>
);

function MicIssueCard({ issue, onRetry }: { issue: MicIssue; onRetry: () => void }) {
  const t = useTranslations('mic');
  return (
    <div className="flex animate-fade-up flex-col gap-5 rounded-card-sm bg-surface p-6 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_1px_2px_rgba(20,22,30,.04)] sm:flex-row sm:items-start">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-error-50 text-error-text">
        <Icon as={ISSUE_ICONS[issue]} size={22} strokeWidth={1.7} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-medium">{t(`${issue}.title`)}</span>
          <span className="text-[13px] leading-normal text-ink-2">{t(`${issue}.text`)}</span>
        </div>
        {issue === 'denied' && (
          <ol className="m-0 flex list-none flex-col gap-2 p-0">
            {(['step1', 'step2'] as const).map((step, i) => (
              <li key={step} className="flex items-center gap-2.5 text-[13px] text-ink-body">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface-sunken font-mono text-[11px] text-ink-2">{i + 1}</span>
                <span className="flex flex-wrap items-center gap-1">{t.rich(`denied.${step}`, { icon: lockIcon })}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
      <Button size="sm" variant="secondary" icon={<Icon as={RotateCcw} size={15} />} onClick={onRetry} className="shrink-0 self-start">
        {t('retry')}
      </Button>
    </div>
  );
}

function PromptCard({ question }: { question: SpeakingQuestion }) {
  const t = useTranslations('exam.speaking');
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {question.image && (
        <div className="grid min-h-60 place-items-center rounded-card-sm bg-[repeating-linear-gradient(135deg,#f1f1f3_0_12px,#ebebee_12px_24px)] font-mono text-xs text-ink-3 shadow-[0_0_0_1px_rgba(20,22,30,.05)]">
          {t('image', { caption: question.image })}
        </div>
      )}
      <div className={cn('flex flex-col justify-center gap-4', !question.image && 'lg:col-span-2')}>
        <span className="font-mono text-xs text-ink-3 uppercase">Part {question.part}</span>
        <p className="m-0 text-[28px] leading-[1.3] tracking-[-0.03em] whitespace-pre-line">{question.prompt}</p>
      </div>
    </div>
  );
}

function RecorderCard({ question, phase, elapsed, bars }: { question: SpeakingQuestion; phase: RecorderPhase; elapsed: number; bars: number[] }) {
  const t = useTranslations('exam.speaking');
  const recording = phase === 'recording';
  return (
    <div className="flex flex-col gap-4 rounded-card-sm bg-surface p-6 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_16px_32px_-20px_rgba(20,22,30,.18)]">
      <div className="flex items-center justify-between">
        <span className={cn('flex items-center gap-2 text-sm font-medium', recording ? 'text-error-text' : 'text-ink-2')} aria-live="polite">
          <span className="relative grid size-[9px] place-items-center">
            {recording && <span className="absolute size-[9px] animate-ping-soft rounded-full bg-error" />}
            <span className={cn('size-[9px] rounded-full', recording ? 'bg-error' : phase === 'done' ? 'bg-green' : 'bg-ink-4')} />
          </span>
          {t(`status.${phase}`)}
        </span>
        <span className="font-mono text-sm text-ink-2">{formatClock(elapsed)} / {formatClock(question.answerSec)}</span>
      </div>
      <div className="flex h-14 items-center gap-[3px]" aria-hidden>
        {Array.from({ length: WAVE_BARS }, (_, i) => (
          <span key={i} className={cn('flex-1 rounded-full transition-[height] duration-150', bars[i] ? 'bg-blue' : 'bg-wave-idle')} style={{ height: `${Math.max(bars[i] ?? 0.12, 0.08) * 100}%` }} />
        ))}
      </div>
      <div className="flex gap-2">
        <span className="rounded-[8px] bg-surface-sunken px-2.5 py-1 text-xs text-ink-2">
          {t('prepChip', { count: question.prepSec })}{phase === 'recording' || phase === 'done' ? ' ✓' : ''}
        </span>
        <span className="rounded-[8px] bg-surface-sunken px-2.5 py-1 text-xs text-ink-2">{t('answerChip', { count: question.answerSec })}</span>
      </div>
    </div>
  );
}

function QuestionView({ question, index, total, onExit, onNext, onFinish }: {
  question: SpeakingQuestion;
  index: number;
  total: number;
  onExit: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const t = useTranslations('exam');
  const client = useCefrClient();
  const setRecording = useAttemptStore((s) => s.setRecording);
  const { phase, issue, secondsLeft, elapsed, bars, start, stop, restart, retry } = useAnswerRecorder(question, (url) => {
    setRecording(question.id, url);
    uploads.upload(client, question.id, url);
  });

  const next = () => {
    if (phase === 'recording') stop();
    onNext();
  };

  return (
    <>
      <ExamHeader
        title="Speaking"
        subtitle={t('speaking.subtitle', { part: question.part, index: index + 1, total })}
        section="speaking"
        timer={phase === 'prep' || phase === 'recording' ? <TimerPill value={formatClock(secondsLeft)} warning={phase === 'recording'} /> : null}
        onExit={onExit}
        onFinish={onFinish}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-6 py-8">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }} aria-hidden>
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={cn('h-1 rounded-[2px]', i < index ? 'bg-green' : i === index ? 'bg-green-300' : 'bg-line')} />
            ))}
          </div>
          <PromptCard question={question} />
          {phase === 'denied' && issue ? (
            <MicIssueCard issue={issue} onRetry={retry} />
          ) : (
            <RecorderCard question={question} phase={phase} elapsed={elapsed} bars={bars} />
          )}
        </div>
      </div>
      <footer className="flex shrink-0 items-center justify-center gap-3 bg-surface px-6 py-3 shadow-[0_-1px_0_rgba(20,22,30,.06)]">
        <button type="button" aria-label={t('speaking.restart')} onClick={restart} disabled={phase !== 'recording' && phase !== 'done'} className={roundButton}>
          <Icon as={RotateCcw} size={18} strokeWidth={1.7} />
        </button>
        {phase === 'recording' ? (
          <button type="button" aria-label={t('speaking.stop')} onClick={stop} className="group grid size-16 place-items-center rounded-full bg-surface shadow-[inset_0_0_0_1px_var(--border),0_14px_28px_-12px_oklch(0.6_0.17_28/.5)] transition-[scale] duration-(--t-sheet) ease-spring hover:scale-105 active:scale-95">
            <span className="size-[22px] rounded-[7px] bg-error transition-[border-radius,scale] duration-(--t-sheet) ease-spring group-hover:scale-90 group-hover:rounded-[11px]" />
          </button>
        ) : (
          <button type="button" aria-label={t('speaking.record')} onClick={phase === 'denied' ? retry : start} disabled={phase !== 'prep' && phase !== 'denied'} className="grid size-16 place-items-center rounded-full bg-action text-white shadow-action transition-[scale] duration-(--t-sheet) ease-spring hover:scale-105 active:scale-95 disabled:opacity-40">
            <Icon as={Mic} size={24} strokeWidth={1.8} />
          </button>
        )}
        <button type="button" aria-label={t('session.nextQuestion')} onClick={next} className={roundButton}>
          <Icon as={ChevronsRight} size={18} strokeWidth={1.7} />
        </button>
      </footer>
    </>
  );
}

export function SpeakingSection({ test }: { test: TestDetail }) {
  const questions = test.speaking;
  const controls = useSessionControls(test, 'speaking');
  const setPosition = useAttemptStore((s) => s.setPosition);
  const [index, setIndex] = useState(() => useAttemptStore.getState().position.speaking ?? 0);

  useEffect(() => {
    setPosition('speaking', index);
  }, [index, setPosition]);

  const question = questions[index];
  const onNext = () => (index === questions.length - 1 ? controls.requestFinish() : setIndex(index + 1));

  return (
    <>
      <QuestionView
        key={question.id}
        question={question}
        index={index}
        total={questions.length}
        onExit={controls.requestExit}
        onNext={onNext}
        onFinish={controls.requestFinish}
      />
      <SessionDialogs controls={controls} />
    </>
  );
}
