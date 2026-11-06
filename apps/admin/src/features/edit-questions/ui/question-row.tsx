import { CheckCircle2, Circle } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Inset } from '@cefr/ui/components/card';
import { isQuestionComplete, type TestDraft } from '@/entities/test';
import { Disclosure, FormTextArea, FormTextField, RowActions } from '@/shared/ui';
import type { PartChoicesPath, QuestionPath } from '../model/paths';
import { QuestionAdvanced } from './question-advanced';
import { QuestionAnswer } from './question-answer';

type QuestionRowProps = {
  path: QuestionPath;
  choicesPath: PartChoicesPath;
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
};

export function QuestionRow({ path, choicesPath, index, count, onMove, onRemove }: QuestionRowProps) {
  const t = useTranslations('question');
  const { control } = useFormContext<TestDraft>();
  const [question, partChoices] = useWatch({ control, name: [path, choicesPath] });
  const complete = isQuestionComplete(question, partChoices);
  const StatusIcon = complete ? CheckCircle2 : Circle;

  return (
    <Inset className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <StatusIcon size={18} className={complete ? 'text-green' : 'text-ink-4'} aria-label={complete ? t('complete') : t('incomplete')} />
        <span className="text-sm font-medium text-ink">{t('badge', { number: Number.isFinite(question.number) ? question.number : '?' })}</span>
        <span className="text-xs text-ink-3">{t(`kinds.${question.kind}`)}</span>
        <div className="ml-auto">
          <RowActions index={index} count={count} onMove={onMove} onRemove={onRemove} />
        </div>
      </div>

      <FormTextArea
        control={control}
        name={`${path}.prompt`}
        ariaLabel={t('prompt')}
        placeholder={question.kind === 'mcq' ? t('promptOptional') : question.kind === 'gap' ? t('gapPlaceholder') : t('prompt')}
        rows={question.kind === 'mcq' ? 1 : 2}
      />

      <QuestionAnswer path={path} choicesPath={choicesPath} />

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Disclosure summary={t('explanation')} defaultOpen={Boolean(question.explanation)}>
          <FormTextField control={control} name={`${path}.explanation`} ariaLabel={t('explanation')} placeholder={t('explanationHint')} />
        </Disclosure>
        <Disclosure summary={t('advanced')}>
          <QuestionAdvanced path={path} />
        </Disclosure>
      </div>
    </Inset>
  );
}
