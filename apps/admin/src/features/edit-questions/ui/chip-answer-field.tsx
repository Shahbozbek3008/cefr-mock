import { Controller, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Chip } from '@cefr/ui/components/chip';
import type { TestDraft } from '@/entities/test';
import type { QuestionPath } from '../model/paths';

type ChipAnswerFieldProps = {
  path: QuestionPath;
  options: readonly string[];
  emptyText?: string;
};

export function ChipAnswerField({ path, options, emptyText }: ChipAnswerFieldProps) {
  const t = useTranslations('question');
  const { control } = useFormContext<TestDraft>();

  if (options.length === 0) return <p className="text-xs text-warning-text">{emptyText}</p>;

  return (
    <Controller
      control={control}
      name={`${path}.answer`}
      render={({ field }) => (
        <div role="radiogroup" aria-label={t('answer')} className="flex flex-wrap gap-1.5">
          {options.map((option) => (
            <Chip key={option} role="radio" aria-checked={field.value === option} active={field.value === option} onClick={() => field.onChange(option)}>
              {option}
            </Chip>
          ))}
        </div>
      )}
    />
  );
}
