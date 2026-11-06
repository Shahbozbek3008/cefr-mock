import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { Inset } from '@cefr/ui/components/card';
import { VOICES, createScriptLine, type TestDraft } from '@/entities/test';
import { FormNumberField, FormSelect, FormTextArea, RowActions } from '@/shared/ui';

export function ScriptEditor({ partIndex }: { partIndex: number }) {
  const t = useTranslations('script');
  const { control, getValues } = useFormContext<TestDraft>();
  const name = `listening.${partIndex}.script` as const;
  const { fields, append, move, remove } = useFieldArray({ control, name, keyName: 'fieldKey' });
  const voiceOptions = VOICES.map((voice) => ({ value: voice, label: t(`voices.${voice}`) }));

  const add = () => append(createScriptLine(getValues(name).at(-1)?.voice));

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, i) => (
        <Inset key={field.fieldKey} className="grid items-start gap-2 p-2 sm:grid-cols-[130px_1fr_90px_90px_auto]">
          <FormSelect control={control} name={`${name}.${i}.voice`} ariaLabel={t('voice')} options={voiceOptions} />
          <FormTextArea control={control} name={`${name}.${i}.text`} ariaLabel={t('textPlaceholder')} placeholder={t('textPlaceholder')} rows={2} />
          <FormNumberField control={control} name={`${name}.${i}.question`} ariaLabel={t('questionTitle')} placeholder={t('question')} min={1} optional />
          <FormNumberField control={control} name={`${name}.${i}.pauseAfter`} ariaLabel={t('pauseTitle')} placeholder={t('pause')} min={0} step={0.1} optional />
          <RowActions index={i} count={fields.length} onMove={(to) => move(i, to)} onRemove={() => remove(i)} />
        </Inset>
      ))}
      <div>
        <Button variant="secondary" size="xs" icon={<Plus size={14} />} onClick={add}>
          {t('addLine')}
        </Button>
      </div>
    </div>
  );
}
