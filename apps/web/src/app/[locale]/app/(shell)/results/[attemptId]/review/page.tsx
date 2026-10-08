import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { SKILLS } from '@/lib/constants';
import { LISTENING_REVIEW, REVIEW_FOCUS, type AnswerStatus } from '@/lib/mock/review';
import { initLocale, metadataTitle, type PageProps } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import { Card, Inset } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/controls';
import { StatGrid } from '@/components/ui/stat-grid';
import { AiLabel } from '@/components/ui/ai-tip';
import { Mark } from '@/components/ui/mark';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AppMain } from '@/components/layout/page-header';
import { ResultsHeader } from '@/components/app/results-header';

export const generateMetadata = metadataTitle('review.title');

const CELL: Record<AnswerStatus, string> = {
  correct: 'bg-success-50 text-success',
  wrong: 'bg-error-50 text-error-text',
  skipped: 'bg-surface-sunken text-ink-3',
};

const count = (s: AnswerStatus) => LISTENING_REVIEW.filter((q) => q.status === s).length;

function AnswerGrid() {
  const t = useTranslations('review');
  return (
    <Card className="flex flex-col gap-[18px] p-5">
      <StatGrid
        size="sm"
        stats={[
          { value: count('correct'), label: t('correct'), tone: 'success' },
          { value: count('wrong'), label: t('wrong'), tone: 'error' },
          { value: count('skipped'), label: t('skipped'), tone: 'muted' },
        ]}
      />
      <div className="grid grid-cols-7 gap-1.5">
        {LISTENING_REVIEW.map((q, i) => (
          <button
            key={q.n}
            type="button"
            aria-current={q.n === REVIEW_FOCUS.n || undefined}
            style={{ animationDelay: `${i * 18}ms` }}
            className={cn('grid h-[38px] animate-pop place-items-center rounded-[11px] font-mono text-xs transition-[scale,box-shadow] duration-(--t-base) ease-spring hover:scale-110', CELL[q.status], q.n === REVIEW_FOCUS.n && 'shadow-[inset_0_0_0_1.5px_var(--error-text),0_0_0_3px_oklch(0.6_0.17_28/.12)]')}
          >
            {q.n}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between pt-[14px] shadow-[0_-1px_0_var(--divider)]">
        <span className="text-sm">{t('onlyWrong')}</span>
        <Switch label={t('onlyWrong')} />
      </div>
    </Card>
  );
}

function Explanation() {
  const t = useTranslations('review');
  const q = REVIEW_FOCUS;
  return (
    <Card elevation="e1" className="flex flex-col gap-[22px] p-[26px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Tag tone="error" size="lg">{t('questionWrong', { n: q.n })}</Tag>
          <span className="text-[13px] text-ink-2">{t('partType', { part: q.part })}</span>
        </div>
        <button type="button" className="flex h-9 items-center gap-2 rounded-[11px] bg-blue-50 px-[14px] text-[13px] font-medium text-blue-text">
          <Play size={11} fill="currentColor" strokeWidth={0} aria-hidden />
          {t('listenFrom', { time: q.audioAt })}
        </button>
      </div>
      <span className="text-[22px] tracking-[-0.02em]">{q.prompt}</span>
      <div className="stagger grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-1 rounded-2xl bg-error-50 px-[18px] py-4">
          <span className="text-xs text-error-text">{t('yourAnswer')}</span>
          <span className="font-mono text-2xl text-error-text line-through decoration-error/60">{q.answer}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-2xl bg-success-50 px-[18px] py-4">
          <span className="text-xs text-success">{t('correctAnswer')}</span>
          <span className="font-mono text-2xl font-medium text-success">{q.correct}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-5 shadow-[0_-1px_0_var(--divider)]">
        <AiLabel>{t('explanation')}</AiLabel>
        <p className="m-0 max-w-[720px] text-[15px] leading-[1.65] text-ink-body">{t('explanationText')}</p>
        <Inset className="px-4 py-[14px] text-sm leading-[1.7] text-ink-body">
          <span className="mr-2 font-mono text-[11px] text-ink-3">{q.audioAt}</span>
          {q.transcriptBefore}<Mark kind="highlight">{q.transcriptMark}</Mark>{q.transcriptAfter}
        </Inset>
      </div>
      <div className="mt-auto flex justify-between">
        <Button variant="secondary" size="sm" icon={<Icon as={ChevronLeft} size={16} />}>Q{q.prev}</Button>
        <Button variant="secondary" size="sm">Q{q.next}<Icon as={ChevronRight} size={16} /></Button>
      </div>
    </Card>
  );
}

function ReviewView() {
  const t = useTranslations('review');
  const ts = useTranslations('skills');
  return (
    <AppMain className="gap-5 overflow-hidden">
      <ResultsHeader
        crumb={t('crumb')}
        title={t('title')}
        actions={<SegmentedControl label={t('title')} defaultValue="listening" className="w-[420px]" options={SKILLS.map((s) => ({ value: s, label: ts(s) }))} />}
      />
      <div className="grid flex-1 gap-4 xl:grid-cols-[380px_1fr]">
        <AnswerGrid />
        <Explanation />
      </div>
    </AppMain>
  );
}

export default async function ReviewPage({ params }: PageProps<{ attemptId: string }>) {
  await initLocale(params);
  return <ReviewView />;
}
