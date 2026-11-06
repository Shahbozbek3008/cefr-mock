import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import type { TestDraft } from '@/entities/test';
import { FormNumberField, FormTextField } from '@/shared/ui';
import type { QuestionPath } from '../model/paths';
import { KindField } from './kind-field';

export function QuestionAdvanced({ path }: { path: QuestionPath }) {
  const t = useTranslations('question');
  const { control } = useFormContext<TestDraft>();

  return (
    <div className="grid gap-3 sm:grid-cols-[100px_1fr_1fr]">
      <FormNumberField control={control} name={`${path}.number`} label={t('number')} min={1} />
      <KindField path={path} />
      <FormTextField control={control} name={`${path}.group`} label={t('group')} hint={t('groupHint')} />
    </div>
  );
}
