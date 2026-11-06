import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { IconButton } from '@cefr/ui/components/icon-button';
import { FormTextField } from '@/shared/ui';
import { letterAt, reletter } from '../model/factories';
import type { QuestionSection, TestDraft } from '../model/types';

export type ChoicesPath = `${QuestionSection}.${number}.choices` | `${QuestionSection}.${number}.questions.${number}.options`;

export function ChoicesField({ name }: { name: ChoicesPath }) {
  const t = useTranslations('choices');
  const { control, getValues } = useFormContext<TestDraft>();
  const { fields, append, replace } = useFieldArray({ control, name, keyName: 'fieldKey' });

  const removeAt = (index: number) => replace(reletter(getValues(name).filter((_, i) => i !== index)));

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, i) => (
        <div key={field.fieldKey} className="flex items-center gap-2">
          <span className="w-6 shrink-0 text-center font-mono text-sm font-semibold text-ink-2">{letterAt(i)}</span>
          <FormTextField control={control} name={`${name}.${i}.text`} ariaLabel={t('placeholder')} placeholder={t('placeholder')} className="flex-1" />
          <IconButton size="xs" icon={Trash2} label={t('remove')} onClick={() => removeAt(i)} />
        </div>
      ))}
      <div>
        <Button variant="ghost" size="xs" icon={<Plus size={14} />} onClick={() => append({ key: letterAt(fields.length), text: '' })}>
          {t('add')}
        </Button>
      </div>
    </div>
  );
}
