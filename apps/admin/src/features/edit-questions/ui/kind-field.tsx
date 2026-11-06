import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { DEFAULT_MCQ_OPTIONS, QUESTION_KINDS, letterChoices, type TestDraft } from '@/entities/test';
import { FormSelect } from '@/shared/ui';
import type { QuestionPath } from '../model/paths';

export function KindField({ path }: { path: QuestionPath }) {
  const t = useTranslations('question');
  const { control, getValues, setValue } = useFormContext<TestDraft>();

  const resetAnswer = (kind: unknown, previous: unknown) => {
    if (kind === previous) return;
    const options = { shouldDirty: true };
    setValue(`${path}.answer`, '', options);
    if (kind === 'mcq' && getValues(`${path}.options`).length === 0) {
      setValue(`${path}.options`, letterChoices(DEFAULT_MCQ_OPTIONS), options);
    }
  };

  return (
    <FormSelect
      control={control}
      name={`${path}.kind`}
      label={t('kind')}
      options={QUESTION_KINDS.map((kind) => ({ value: kind, label: t(`kinds.${kind}`) }))}
      onValueChange={resetAnswer}
    />
  );
}
