'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import {
  buildReview,
  formatClock,
  sectionTitles,
  useResult,
  useTest,
  useTestKeys,
  useTestScripts,
  type AnswerReview,
  type Choice,
  type ListeningPart,
  type PartTranscript,
  type Question,
  type ReviewStatus,
} from '@cefr/core';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { failureKey } from '@/lib/exam/session';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/controls';
import { panelSurface } from '@/components/dashboard/panel';
import { ResultsTopbar, SkeletonBlocks, StatePanel } from './shared';

type Tab = 'listening' | 'reading';

const STATUS_CELL: Record<ReviewStatus, string> = {
  correct: 'bg-success-50 text-success',
  wrong: 'bg-error-50 text-error-text',
  empty: 'bg-surface-sunken text-ink-3',
};

const STATUS_TONE = { correct: 'success', wrong: 'error', empty: 'neutral' } as const;

const VOICES = ['narrator', 'woman', 'man', 'woman2', 'man2', 'woman3', 'man3'] as const;

const audioMarks = (parts: ListeningPart[]): Record<number, number> => Object.assign({}, ...parts.map((part) => part.audioAt));

const answerText = (question: Question, value: string, choices?: Choice[]) => {
  if (!value.trim()) return '—';
  const options = question.kind === 'mcq' ? question.options : question.kind === 'match' ? choices : undefined;
  const option = options?.find((o) => o.key === value);
  return option ? `${option.key} · ${option.text}` : value;
};

function AnswerDetail({ item, question, choices }: { item: AnswerReview; question: Question; choices?: Choice[] }) {
  const t = useTranslations('exam.review');
  return (
    <div className={cn(panelSurface, 'flex flex-col gap-5 p-6')}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tag tone={STATUS_TONE[item.status]} size="lg" className="font-mono">Q{item.number} · {t(`status.${item.status}`)}</Tag>
        {item.audioAt !== undefined && (
          <span className="flex items-center gap-1.5 rounded-[10px] bg-blue-50 px-3 py-1.5 text-[13px] font-medium text-blue-text">
            <Icon as={Play} size={11} fill="currentColor" strokeWidth={0} />
            {t('listenFrom', { time: formatClock(item.audioAt) })}
          </span>
        )}
      </div>
      <span className="text-[19px] leading-snug tracking-[-0.015em]">{item.prompt}</span>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className={cn('flex flex-col gap-1 rounded-2xl px-4 py-3.5', item.status === 'correct' ? 'bg-success-50 text-success' : item.status === 'wrong' ? 'bg-error-50 text-error-text' : 'bg-surface-muted text-ink-2')}>
          <span className="text-xs">{t('yourAnswer')}</span>
          <span className={cn('font-mono text-lg', item.status === 'wrong' && 'line-through decoration-error/60')}>{answerText(question, item.yourAnswer, choices)}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-success-50 px-4 py-3.5 text-success">
          <span className="text-xs">{t('correctAnswer')}</span>
          <span className="font-mono text-lg font-medium">{item.correctAnswer || '—'}</span>
        </div>
      </div>
      {item.explanation && <p className="m-0 border-t border-divider pt-4 text-[15px] leading-relaxed text-ink-body">{item.explanation}</p>}
    </div>
  );
}

const segmentOf = (transcript: PartTranscript, questionNumber: number) => {
  const lines = transcript.lines;
  const start = lines.findIndex((line) => line.question === questionNumber);
  if (start < 0) return { start: 0, end: lines.length };
  const next = lines.findIndex((line, index) => index > start && line.question !== undefined && line.question !== questionNumber);
  return { start, end: next < 0 ? lines.length : next };
};

function TranscriptCard({ transcript, questionNumber }: { transcript: PartTranscript; questionNumber: number }) {
  const t = useTranslations('exam.review');
  const [expanded, setExpanded] = useState(false);
  const { start, end } = segmentOf(transcript, questionNumber);
  const lines = transcript.lines.map((line, index) => ({ line, index })).filter(({ index }) => expanded || (index >= start && index < end));

  return (
    <div className={cn(panelSurface, 'flex flex-col gap-3 p-5')}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-2">{t('transcript')}</span>
        <button type="button" onClick={() => setExpanded((value) => !value)} className="text-[13px] font-medium text-green-text hover:text-green-hover">
          {t(expanded ? 'transcriptQuestion' : 'transcriptFull')}
        </button>
      </div>
      {lines.map(({ line, index }) => {
        const active = index >= start && index < end;
        const voice = (VOICES as readonly string[]).includes(line.voice) ? (line.voice as (typeof VOICES)[number]) : 'narrator';
        return (
          <div key={index} className={cn('flex flex-col gap-0.5 rounded-[10px] px-3 py-2', expanded && active && 'bg-highlight/40')}>
            <span className="text-[11px] text-ink-3">{t(`voices.${voice}`)}</span>
            <span className={cn('text-[15px] leading-relaxed', active ? 'text-ink' : 'text-ink-2')}>{line.text}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ReviewView({ id, initialTab }: { id: string; initialTab?: string }) {
  const t = useTranslations('exam');
  const result = useResult(id);
  const testId = result.data?.testId ?? '';
  const test = useTest(testId);
  const keys = useTestKeys(testId);
  const scripts = useTestScripts(testId);
  const tabs = (['listening', 'reading'] as const).filter((tab) => !result.data || result.data.scope === 'full' || result.data.scope === tab);
  const [tab, setTab] = useState<Tab>(() => (initialTab === 'reading' ? 'reading' : 'listening'));
  const activeTab = tabs.includes(tab) ? tab : tabs[0];
  const [onlyWrong, setOnlyWrong] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const parts = activeTab ? test.data?.[activeTab] : undefined;
  const questions = useMemo(() => parts?.flatMap((p) => p.questions) ?? [], [parts]);
  const review = useMemo(() => {
    if (!activeTab || !test.data || !result.data || !keys.data) return null;
    return buildReview(questions, keys.data, result.data.answers, activeTab === 'listening' ? audioMarks(test.data.listening) : {});
  }, [activeTab, keys.data, questions, result.data, test.data]);

  const wrong = review?.items.filter((i) => i.status !== 'correct') ?? [];
  const navigable = onlyWrong ? wrong : (review?.items ?? []);
  const current = review?.items.find((i) => i.questionId === selectedId) ?? navigable[0] ?? review?.items[0];
  const position = current ? navigable.indexOf(current) : -1;
  const question = questions.find((q) => q.id === current?.questionId);
  const part = parts?.find((p) => p.questions.some((q) => q.id === question?.id));
  const transcript = activeTab === 'listening' ? scripts.data?.find((item) => item.partId === part?.id) : undefined;

  const step = (delta: number) => {
    const target = navigable[Math.max(0, Math.min(navigable.length - 1, position + delta))];
    if (target) setSelectedId(target.questionId);
  };

  if (result.isError || test.isError) {
    return <StatePanel title={t('common.error')} message={t(`common.${failureKey(result.error ?? test.error)}`)} action={t('common.retry')} onAction={() => (result.isError ? result.refetch() : test.refetch())} />;
  }

  return (
    <>
      <ResultsTopbar
        back={ROUTES.result(id)}
        title={t('review.title')}
        meta={test.data && activeTab ? t('review.subtitle', { number: test.data.number, section: sectionTitles[activeTab] }) : undefined}
        actions={
          tabs.length > 1 && (
            <div role="tablist" className="flex h-9 rounded-[11px] bg-seg-track p-[3px] text-[13px]">
              {tabs.map((value) => (
                <button key={value} type="button" role="tab" aria-selected={activeTab === value} onClick={() => { setTab(value); setSelectedId(null); }} className={cn('rounded-[8px] px-4 transition-colors', activeTab === value ? 'bg-surface font-medium text-ink shadow-[0_1px_2px_rgba(20,22,30,.08)]' : 'text-ink-2 hover:text-ink')}>
                  {sectionTitles[value]}
                </button>
              ))}
            </div>
          )
        }
      />
      {!review || !current || !question ? (
        <SkeletonBlocks count={2} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className={cn(panelSurface, 'flex h-fit flex-col gap-4 p-5')}>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-divider-muted">
              {([['correct', review.correct, 'text-success'], ['wrong', review.wrong, 'text-error-text'], ['empty', review.empty, 'text-ink']] as const).map(([key, value, tone]) => (
                <div key={key} className="flex flex-col gap-0.5 bg-surface-muted px-3.5 py-3">
                  <span className={cn('font-mono text-[22px]', tone)}>{value}</span>
                  <span className="text-xs text-ink-2">{t(`review.${key}`)}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {review.items.map((item, i) => (
                <button
                  key={item.questionId}
                  type="button"
                  onClick={() => setSelectedId(item.questionId)}
                  aria-current={item.questionId === current.questionId || undefined}
                  style={{ animationDelay: `${i * 14}ms` }}
                  className={cn('grid h-[38px] animate-pop place-items-center rounded-[11px] font-mono text-xs transition-[scale,box-shadow] duration-(--t-base) ease-spring hover:scale-110', STATUS_CELL[item.status], item.questionId === current.questionId && 'shadow-[inset_0_0_0_1.5px_currentColor,0_0_0_3px_rgba(20,22,30,.06)]')}
                >
                  {item.number}
                </button>
              ))}
            </div>
            <label className="flex items-center justify-between pt-3 text-sm shadow-[0_-1px_0_var(--divider)]">
              {t('review.onlyWrong')}
              <Switch label={t('review.onlyWrongA11y')} checked={onlyWrong} onCheckedChange={setOnlyWrong} />
            </label>
          </div>
          <div className="flex flex-col gap-3">
            <AnswerDetail item={current} question={question} choices={part?.choices} />
            {transcript && <TranscriptCard key={current.questionId} transcript={transcript} questionNumber={current.number} />}
            <div className="flex items-center justify-between gap-3">
              <Button variant="secondary" size="sm" disabled={position <= 0} onClick={() => step(-1)} icon={<Icon as={ChevronLeft} size={16} />}>{t('common.previous')}</Button>
              <span className="font-mono text-[13px] text-ink-2">{t(onlyWrong ? 'review.onlyWrong' : 'review.allQuestions')} · {position >= 0 ? position + 1 : '–'}/{navigable.length}</span>
              <Button variant="secondary" size="sm" disabled={position >= navigable.length - 1} onClick={() => step(1)}>
                {t('common.next')}
                <Icon as={ChevronRight} size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
