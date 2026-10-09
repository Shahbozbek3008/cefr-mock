'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Highlight, McqQuestion, PassageParagraph, Question, ReadingPart, TestDetail } from '@cefr/core';
import { cn } from '@/lib/cn';
import { useAttemptStore } from '@/lib/attempt-store';
import { useSessionControls } from '@/lib/exam/session';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ExamFooter, ExamHeader, SectionTimer, footerNavigator } from './exam-header';
import { SessionDialogs } from './session-dialogs';
import { FlagButton, GapInput, McqOptions, QuestionNavigator, TfngChoices } from './question-inputs';

const EMPTY: Highlight[] = [];
const FILL: Record<Highlight['color'], string> = { yellow: 'bg-highlight', blue: 'bg-blue-100' };

function Paragraph({ paragraph, highlight, serif, selected, onSelect, onPick }: {
  paragraph: PassageParagraph;
  highlight?: Highlight;
  serif: boolean;
  selected: boolean;
  onSelect: () => void;
  onPick: (color: Highlight['color']) => void;
}) {
  const t = useTranslations('exam.reading');
  const fill = highlight ? FILL[highlight.color] : undefined;
  const phrase = paragraph.highlight;
  const [before, after] = phrase ? paragraph.text.split(phrase) : [paragraph.text, ''];

  return (
    <div className="relative grid grid-cols-[20px_1fr] gap-2.5 sm:grid-cols-[24px_1fr] sm:gap-[14px]">
      <button type="button" onClick={onSelect} className="h-fit pt-1.5 text-left font-mono text-xs text-ink-3 hover:text-ink">{paragraph.label}</button>
      <p onDoubleClick={onSelect} className={cn('m-0 max-w-[68ch] text-base leading-[1.75] text-ink-reading sm:text-[17px] sm:leading-[1.8]', serif && 'font-serif')}>
        {phrase && fill ? (
          <>
            {before}
            <mark className={cn('rounded-[3px] px-0.5 text-inherit', fill)}>{phrase}</mark>
            {after}
          </>
        ) : (
          <span className={cn(fill && 'rounded-[3px] px-0.5', fill)}>{paragraph.text}</span>
        )}
      </p>
      {selected && (
        <div role="toolbar" className="absolute -top-11 left-7 z-10 sm:left-9 flex h-[38px] animate-pop items-center gap-1.5 rounded-[12px] bg-surface px-2 shadow-[0_0_0_1px_rgba(20,22,30,.06),0_14px_28px_-12px_rgba(20,22,30,.3)]">
          <button type="button" aria-label={t('highlightYellow')} onClick={() => onPick('yellow')} className={cn('size-5 rounded-full bg-highlight', highlight?.color === 'yellow' && 'ring-2 ring-white ring-offset-1 ring-offset-line-strong')} />
          <button type="button" aria-label={t('highlightBlue')} onClick={() => onPick('blue')} className={cn('size-5 rounded-full bg-blue-100', highlight?.color === 'blue' && 'ring-2 ring-white ring-offset-1 ring-offset-line-strong')} />
        </div>
      )}
    </div>
  );
}

function Passage({ part, serif, className }: { part: ReadingPart; serif: boolean; className?: string }) {
  const highlights = useAttemptStore((s) => s.highlights[part.id] ?? EMPTY);
  const toggleHighlight = useAttemptStore((s) => s.toggleHighlight);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <article className={cn('flex min-h-0 flex-col gap-5 overflow-y-auto bg-surface px-4 py-5 shadow-[1px_0_0_rgba(20,22,30,.06)] sm:gap-6 sm:px-6 sm:py-6 lg:px-10 lg:py-8', className)}>
      <h2 className="m-0 text-[22px] leading-[1.2] font-medium tracking-[-0.03em] sm:text-[28px] sm:leading-[1.15] sm:tracking-[-0.035em]">{part.title}</h2>
      {part.passage.map((paragraph) => (
        <Paragraph
          key={paragraph.label}
          paragraph={paragraph}
          serif={serif}
          highlight={highlights.find((h) => h.paragraph === paragraph.label)}
          selected={selected === paragraph.label}
          onSelect={() => setSelected((current) => (current === paragraph.label ? null : paragraph.label))}
          onPick={(color) => {
            toggleHighlight(part.id, { paragraph: paragraph.label, color });
            setSelected(null);
          }}
        />
      ))}
    </article>
  );
}

function QuestionPanel({ question, part }: { question: Question; part: ReadingPart }) {
  const t = useTranslations('exam.reading');
  return (
    <div key={question.id} className="flex animate-fade-up flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <span className="rounded-[7px] bg-green-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-green-text">Q{question.number}</span>
        <span className="text-[13px] text-ink-2">{t(`kinds.${question.kind}`)}</span>
      </div>
      <p className="m-0 text-base leading-[1.55] sm:text-[17px]">{question.prompt}</p>
      {question.kind === 'tfng' && <TfngChoices questionId={question.id} />}
      {question.kind === 'mcq' && <McqOptions question={question} />}
      {question.kind === 'gap' && <GapInput questionId={question.id} number={question.number} variant="field" />}
      {question.kind === 'match' && part.choices && <McqOptions question={{ ...question, kind: 'mcq', options: part.choices } as McqQuestion} />}
    </div>
  );
}

type Pane = 'text' | 'questions';

export function ReadingSection({ test }: { test: TestDetail }) {
  const t = useTranslations('exam');
  const parts = test.reading;
  const questions = useMemo(() => parts.flatMap((p) => p.questions), [parts]);
  const controls = useSessionControls(test, 'reading', questions);
  const setPosition = useAttemptStore((s) => s.setPosition);
  const [index, setIndex] = useState(() => useAttemptStore.getState().position.reading ?? 0);
  const [serif, setSerif] = useState(false);
  const [pane, setPane] = useState<Pane>('text');

  const question = questions[index];
  const partIndex = parts.findIndex((p) => p.questions.includes(question));
  const part = parts[partIndex];
  const lastIndex = questions.length - 1;

  useEffect(() => {
    setPosition('reading', index);
  }, [index, setPosition]);

  const goTo = (target: number) => {
    setIndex(Math.max(0, Math.min(lastIndex, target)));
    setPane('questions');
  };

  const selectById = (id: string) => goTo(questions.findIndex((q) => q.id === id));
  const onReview = (number: number) => goTo(questions.findIndex((q) => q.number === number));
  const first = part.questions[0].number;
  const last = part.questions[part.questions.length - 1].number;

  return (
    <>
      <ExamHeader
        title="Reading"
        subtitle={`Part ${partIndex + 1} / ${parts.length}`}
        section="reading"
        timer={<SectionTimer section="reading" onExpire={controls.finish} />}
        onExit={controls.requestExit}
        onFinish={controls.requestFinish}
      />
      <div className="shrink-0 bg-surface px-4 py-2.5 shadow-[0_1px_0_rgba(20,22,30,.06)] sm:px-6 lg:hidden">
        <SegmentedControl
          label={t('reading.modes.text')}
          value={pane}
          onValueChange={(value) => setPane(value as Pane)}
          options={[
            { value: 'text', label: t('reading.modes.text') },
            { value: 'questions', label: `${t('reading.modes.questions')} ${first}–${last}` },
          ]}
        />
      </div>
      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] lg:grid-cols-[1.15fr_1fr]">
        <Passage key={part.id} part={part} serif={serif} className={cn(pane !== 'text' && 'max-lg:hidden')} />
        <div className={cn('flex min-h-0 flex-col gap-5 overflow-y-auto px-4 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:px-10 lg:py-8', pane !== 'questions' && 'max-lg:hidden')}>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs text-ink-3 uppercase">{t('session.questions')} {first}–{last}</span>
            <button
              type="button"
              aria-pressed={serif}
              aria-label={t('reading.serif')}
              onClick={() => setSerif((value) => !value)}
              className={cn('h-8 rounded-[9px] px-2.5 font-serif text-sm transition-colors', serif ? 'bg-green-100 text-green-text' : 'bg-surface shadow-inset hover:bg-bg-app')}
            >
              Aa
            </button>
          </div>
          <span className="text-[15px] leading-[1.55] text-ink-2">{part.instruction}</span>
          <QuestionPanel question={question} part={part} />
        </div>
      </div>
      <ExamFooter>
        <FlagButton questionId={question.id} />
        <QuestionNavigator questions={part.questions} currentId={question.id} onSelect={selectById} className={footerNavigator} />
        <Button
          variant="secondary"
          size="md"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
          icon={<Icon as={ChevronLeft} size={16} />}
          className="max-sm:w-11 max-sm:gap-0 max-sm:px-0"
        >
          <span className="max-sm:sr-only">{t('common.previous')}</span>
        </Button>
        <Button size="md" onClick={() => (index === lastIndex ? controls.requestFinish() : goTo(index + 1))} className="max-sm:flex-1">
          {index === lastIndex ? t('common.finish') : t('common.next')}
          <Icon as={ChevronRight} size={16} />
        </Button>
      </ExamFooter>
      <SessionDialogs controls={controls} onReview={onReview} />
    </>
  );
}
