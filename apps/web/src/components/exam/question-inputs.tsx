'use client';

import { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import { Flag } from 'lucide-react';
import { tfngChoices, type Choice, type McqQuestion, type Question } from '@cefr/core';
import { cn } from '@/lib/cn';
import { useAnswer, useAttemptStore, useIsFlagged } from '@/lib/attempt-store';
import { Icon } from '@/components/ui/icon';

const pad = (n: number) => String(n).padStart(2, '0');

type GapInputProps = { questionId: string; number: number; variant?: 'inline' | 'field'; onFocus?: (id: string) => void };

export const GapInput = forwardRef<HTMLInputElement, GapInputProps>(function GapInput({ questionId, number, variant = 'inline', onFocus }, ref) {
  const t = useTranslations('exam.session');
  const value = useAnswer(questionId);
  const setAnswer = useAttemptStore((s) => s.setAnswer);
  const filled = value.trim() !== '';

  return (
    <label
      className={cn(
        'group inline-flex items-center gap-2 rounded-[11px] bg-surface px-3 transition-[box-shadow,width] duration-(--t-sheet) ease-out-expo focus-within:shadow-focus',
        variant === 'inline' ? 'h-[38px] w-[170px]' : 'h-12 w-full max-w-[360px]',
        filled ? 'shadow-[inset_0_0_0_1px_var(--border-strong)]' : 'shadow-inset',
      )}
    >
      <span className={cn('font-mono text-[11px]', filled ? 'text-blue' : 'text-ink-3', 'group-focus-within:text-blue')}>{pad(number)}</span>
      <input
        ref={ref}
        value={value}
        onChange={(e) => setAnswer(questionId, e.target.value)}
        onFocus={() => onFocus?.(questionId)}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder={variant === 'field' ? t('answerPlaceholder') : undefined}
        aria-label={t('answerOf', { number })}
        className="min-w-0 flex-1 bg-transparent text-[15px] caret-green outline-none placeholder:text-ink-disabled"
      />
    </label>
  );
});

type McqOptionsProps = { question: McqQuestion; onAnswer?: (id: string) => void };

export function McqOptions({ question, onAnswer }: McqOptionsProps) {
  const value = useAnswer(question.id);
  const setAnswer = useAttemptStore((s) => s.setAnswer);
  return (
    <div role="radiogroup" className="flex flex-col gap-2">
      {question.options.map((option) => {
        const selected = value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              setAnswer(question.id, option.key);
              onAnswer?.(question.id);
            }}
            className={cn(
              'flex min-h-12 items-center gap-3 rounded-[13px] px-3.5 py-2.5 text-left text-[15px] transition-[background-color,box-shadow] duration-(--t-base)',
              selected ? 'bg-green-50 shadow-[inset_0_0_0_1.5px_var(--green-500)]' : 'bg-surface shadow-inset hover:bg-bg-app',
            )}
          >
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-[8px] font-mono text-xs font-medium transition-colors',
                selected ? 'bg-action text-white' : 'bg-surface-sunken text-ink-2',
              )}
            >
              {option.key}
            </span>
            <span className="flex-1 leading-snug">{option.text}</span>
          </button>
        );
      })}
    </div>
  );
}

type MatchChipsProps = { questionId: string; choices: Choice[]; onAnswer?: (id: string) => void };

export function MatchChips({ questionId, choices, onAnswer }: MatchChipsProps) {
  const value = useAnswer(questionId);
  const setAnswer = useAttemptStore((s) => s.setAnswer);
  return (
    <div role="radiogroup" className="flex flex-wrap gap-1.5">
      {choices.map((choice) => {
        const selected = value === choice.key;
        return (
          <button
            key={choice.key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${choice.key}. ${choice.text}`}
            title={choice.text}
            onClick={() => {
              setAnswer(questionId, choice.key);
              onAnswer?.(questionId);
            }}
            className={cn(
              'grid size-[38px] place-items-center rounded-[11px] font-mono text-[13px] font-medium transition-[background-color,color,scale] duration-(--t-base) active:scale-95',
              selected ? 'bg-action text-white shadow-action-sm' : 'bg-surface text-ink shadow-inset hover:bg-bg-app',
            )}
          >
            {choice.key}
          </button>
        );
      })}
    </div>
  );
}

export function TfngChoices({ questionId }: { questionId: string }) {
  const value = useAnswer(questionId);
  const setAnswer = useAttemptStore((s) => s.setAnswer);
  return (
    <div role="radiogroup" className="grid max-w-[420px] grid-cols-3 gap-1.5">
      {tfngChoices.map((choice) => {
        const selected = value === choice;
        return (
          <button
            key={choice}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setAnswer(questionId, choice)}
            className={cn(
              'h-[38px] rounded-[11px] text-[13px] transition-[background-color,color,box-shadow,scale] duration-(--t-base) active:scale-95',
              selected ? 'bg-action font-medium text-white' : 'bg-surface text-ink-body shadow-inset hover:bg-bg-app',
            )}
          >
            {choice}
          </button>
        );
      })}
    </div>
  );
}

export function QuestionCell({ question, current, onSelect }: { question: Question; current: boolean; onSelect: (id: string) => void }) {
  const t = useTranslations('exam.session');
  const answered = useAnswer(question.id).trim() !== '';
  const flagged = useIsFlagged(question.id);
  return (
    <button
      type="button"
      aria-label={t('question', { number: question.number })}
      aria-current={current || undefined}
      onClick={() => onSelect(question.id)}
      className={cn(
        'relative grid h-9 min-w-9 place-items-center rounded-[10px] px-1 font-mono text-xs transition-[background-color,color,scale] duration-(--t-base) ease-spring hover:scale-105',
        current ? 'bg-action font-medium text-white shadow-[0_0_0_3px_var(--green-100)]' : answered ? 'bg-green-100 text-green-text' : 'bg-surface text-ink-2 shadow-inset',
      )}
    >
      {pad(question.number)}
      {flagged && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-warning" />}
    </button>
  );
}

export function QuestionNavigator({ questions, currentId, onSelect }: { questions: Question[]; currentId: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {questions.map((q) => (
        <QuestionCell key={q.id} question={q} current={q.id === currentId} onSelect={onSelect} />
      ))}
    </div>
  );
}

export function FlagButton({ questionId }: { questionId: string }) {
  const t = useTranslations('exam.session');
  const flagged = useIsFlagged(questionId);
  const toggleFlag = useAttemptStore((s) => s.toggleFlag);
  return (
    <button
      type="button"
      aria-pressed={flagged}
      aria-label={flagged ? t('unflag') : t('flag')}
      onClick={() => toggleFlag(questionId)}
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-[13px] transition-[background-color,box-shadow,color] duration-(--t-base)',
        flagged ? 'bg-warning-50 text-warning-text shadow-[inset_0_0_0_1px_var(--warning-200)]' : 'bg-surface text-ink-body shadow-inset hover:bg-bg-app',
      )}
    >
      <Icon as={Flag} size={17} fill={flagged ? 'var(--warning-500)' : 'none'} />
    </button>
  );
}

export function InstructionBlock({ range, instruction, emphasis }: { range: string; instruction: string; emphasis?: string }) {
  const t = useTranslations('exam.session');
  const [before, after] = emphasis ? instruction.split(emphasis) : [instruction, ''];
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-ink-3 uppercase">{t('questions')} {range}</span>
      <p className="m-0 text-sm leading-normal text-ink-2">
        {before}
        {emphasis && <b className="font-medium text-ink">{emphasis}</b>}
        {emphasis && after}
      </p>
    </div>
  );
}
