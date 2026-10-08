import { useTranslations } from 'next-intl';
import { MAX_SCORE } from '@/lib/constants';
import { ESSAY } from '@/lib/mock/ai-feedback';
import { WRITING_CRITERIA } from '@/lib/mock/results';
import { initLocale, metadataTitle, type PageProps } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import { Card } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { CriteriaList } from '@/components/ui/criteria-list';
import { Correction, MarkLegend } from '@/components/ui/mark';
import { MonoLabel } from '@/components/ui/typography';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AppMain } from '@/components/layout/page-header';
import { ResultsHeader } from '@/components/app/results-header';
import { AnnotatedText } from '@/components/app/annotated-text';
import { CountUp } from '@/components/motion/count-up';

export const generateMetadata = metadataTitle('aiWriting.title');

function ScoreBanner() {
  const t = useTranslations('aiWriting');
  return (
    <div className="relative isolate flex items-center gap-5 overflow-hidden rounded-card bg-hero px-[22px] py-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.18)]">
      <span aria-hidden className="pointer-events-none absolute -top-1/2 -right-1/4 -z-10 size-72 animate-aurora rounded-full bg-[oklch(0.7_0.14_200/.45)] blur-[80px]" />
      <span className="flex items-baseline gap-1.5">
        <span className="text-[52px] leading-[.9] font-light tracking-[-0.06em]"><CountUp value={ESSAY.score} /></span>
        <span className="font-mono text-[13px] text-white/60">/{MAX_SCORE}</span>
      </span>
      <span className="flex flex-col gap-1 text-[13px] leading-[1.45] text-white/85">
        <span className="text-[15px] font-medium text-white">{t('level')}</span>
        {t('verdict')}
      </span>
    </div>
  );
}

function Corrections() {
  const t = useTranslations('aiWriting');
  return (
    <Card className="flex flex-col gap-2 p-[18px] shadow-[0_0_0_1px_rgba(20,22,30,.05)]">
      <span className="pb-1 text-sm font-medium">{t('corrections')}</span>
      {ESSAY.corrections.map((c, i) => (
        <div
          key={c.from}
          style={{ animationDelay: `${200 + i * 90}ms` }}
          className={cn('flex animate-fade-up flex-col gap-1.5 rounded-2xl px-4 py-[14px] transition-[translate,box-shadow] duration-(--t-base) ease-out-expo hover:-translate-y-0.5', i === 0 ? 'bg-surface shadow-[inset_0_0_0_1.5px_var(--error-text)]' : 'bg-surface-muted')}
        >
          <Tag tone={c.kind === 'grammar' ? 'error' : 'warning'} size="sm" className="self-start">{t(`kinds.${c.kind}`)}</Tag>
          <Correction from={c.from} to={c.to} />
          <span className="text-xs leading-normal text-ink-2">{t(`notes.${c.noteKey}`)}</span>
        </div>
      ))}
    </Card>
  );
}

function AiWritingView() {
  const t = useTranslations('aiWriting');
  return (
    <AppMain className="gap-5 overflow-hidden">
      <ResultsHeader
        crumb="Writing"
        title={t('title')}
        actions={
          <>
            <SegmentedControl label={t('title')} defaultValue="task2" className="w-[220px]" options={[{ value: 'task1', label: 'Task 1' }, { value: 'task2', label: 'Task 2' }]} />
            <Button size="sm" className="px-[18px]">{t('improved')}</Button>
          </>
        }
      />
      <div className="grid flex-1 gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="flex flex-col gap-[18px] px-8 py-7 shadow-[0_0_0_1px_rgba(20,22,30,.05)]">
          <div className="flex items-center justify-between">
            <MonoLabel>{t('yourText', { words: ESSAY.words })}</MonoLabel>
            <MarkLegend items={[{ kind: 'grammar', label: `Grammar · ${ESSAY.grammarErrors}` }, { kind: 'lexical', label: t('lexicalCount', { count: ESSAY.lexicalIssues }) }]} />
          </div>
          <div className="flex max-w-[760px] flex-col gap-[1.9em] text-[17px] leading-[1.9] text-ink-reading">
            {ESSAY.paragraphs.map((p, i) => <p key={i} className="m-0"><AnnotatedText segments={p} /></p>)}
          </div>
        </Card>
        <div className="stagger flex flex-col gap-3">
          <ScoreBanner />
          <CriteriaList items={WRITING_CRITERIA} className="rounded-card bg-surface px-5 py-1 shadow-[0_0_0_1px_rgba(20,22,30,.05)]" />
          <Corrections />
        </div>
      </div>
    </AppMain>
  );
}

export default async function AiWritingPage({ params }: PageProps<{ attemptId: string }>) {
  await initLocale(params);
  return <AiWritingView />;
}
