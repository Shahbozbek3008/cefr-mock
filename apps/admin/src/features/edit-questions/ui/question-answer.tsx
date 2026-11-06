import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { TFNG_ANSWERS, type TestDraft } from '@/entities/test';
import { FormTextField } from '@/shared/ui';
import type { PartChoicesPath, QuestionPath } from '../model/paths';
import { ChipAnswerField } from './chip-answer-field';
import { OptionsAnswerField } from './options-answer-field';

export function QuestionAnswer({ path, choicesPath }: { path: QuestionPath; choicesPath: PartChoicesPath }) {
  const t = useTranslations('question');
  const { control } = useFormContext<TestDraft>();
  const [kind, partChoices] = useWatch({ control, name: [`${path}.kind`, choicesPath] });

  switch (kind) {
    case 'mcq':
      return <OptionsAnswerField path={path} />;
    case 'tfng':
      return <ChipAnswerField path={path} options={TFNG_ANSWERS} />;
    case 'match':
      return <ChipAnswerField path={path} options={partChoices.map((choice) => choice.key)} emptyText={t('noPartChoices')} />;
    case 'gap':
      return <FormTextField control={control} name={`${path}.answer`} label={t('answer')} placeholder={t('answerPlaceholder')} className="sm:max-w-sm" />;
  }
}
