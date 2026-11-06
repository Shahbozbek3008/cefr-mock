import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { Inset } from '@cefr/ui/components/card';
import type { TestDraft } from '@/entities/test';
import { FormTextArea, FormTextField, RowActions } from '@/shared/ui';

export function PassageField({ partIndex }: { partIndex: number }) {
  const t = useTranslations('passage');
  const { control } = useFormContext<TestDraft>();
  const name = `reading.${partIndex}.passage` as const;
  const { fields, append, move, remove } = useFieldArray({ control, name, keyName: 'fieldKey' });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, i) => (
        <Inset key={field.fieldKey} className="grid items-start gap-2 p-2 sm:grid-cols-[120px_1fr_auto]">
          <FormTextField control={control} name={`${name}.${i}.label`} ariaLabel={t('label')} placeholder={t('label')} />
          <div className="flex flex-col gap-2">
            <FormTextArea control={control} name={`${name}.${i}.text`} ariaLabel={t('text')} placeholder={t('text')} rows={4} />
            <FormTextField control={control} name={`${name}.${i}.highlight`} ariaLabel={t('highlight')} placeholder={t('highlight')} />
          </div>
          <RowActions index={i} count={fields.length} onMove={(to) => move(i, to)} onRemove={() => remove(i)} />
        </Inset>
      ))}
      <div>
        <Button variant="secondary" size="xs" icon={<Plus size={14} />} onClick={() => append({ label: '', text: '' })}>
          {t('add')}
        </Button>
      </div>
    </div>
  );
}
