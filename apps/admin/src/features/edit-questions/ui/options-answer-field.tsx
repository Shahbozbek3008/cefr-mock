import { Plus, Trash2 } from 'lucide-react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { RadioDot } from '@cefr/ui/components/controls';
import { IconButton } from '@cefr/ui/components/icon-button';
import { letterAt, reletter, type TestDraft } from '@/entities/test';
import { FormTextField } from '@/shared/ui';
import type { QuestionPath } from '../model/paths';

export function OptionsAnswerField({ path }: { path: QuestionPath }) {
  const t = useTranslations('question');
  const { control, getValues, setValue } = useFormContext<TestDraft>();
  const name = `${path}.options` as const;
  const { fields, append, replace } = useFieldArray({ control, name, keyName: 'fieldKey' });

  const removeAt = (index: number) => {
    const removedKey = getValues(name)[index]?.key;
    const answer = getValues(`${path}.answer`);
    replace(reletter(getValues(name).filter((_, i) => i !== index)));
    if (answer === removedKey) setValue(`${path}.answer`, '', { shouldDirty: true });
  };

  return (
    <div className="flex flex-col gap-2">
      <Controller
        control={control}
        name={`${path}.answer`}
        render={({ field: answer }) =>
          <>
            {fields.map((option, i) => {
              const key = letterAt(i);
              const checked = answer.value === key;
              return (
                <div key={option.fieldKey} className="flex items-center gap-2">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    aria-label={t('markCorrect', { key })}
                    data-state={checked ? 'checked' : 'unchecked'}
                    className="group flex shrink-0 items-center gap-2 rounded-sm px-1 py-1"
                    onClick={() => answer.onChange(key)}
                  >
                    <RadioDot size={18} />
                    <span className="w-4 font-mono text-sm font-semibold text-ink-2 group-data-[state=checked]:text-green-text">{key}</span>
                  </button>
                  <FormTextField control={control} name={`${name}.${i}.text`} ariaLabel={t('optionText', { key })} placeholder={t('optionText', { key })} className="flex-1" />
                  <IconButton size="xs" icon={Trash2} label={t('removeOption')} onClick={() => removeAt(i)} />
                </div>
              );
            })}
          </>
        }
      />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="xs" icon={<Plus size={14} />} onClick={() => append({ key: letterAt(fields.length), text: '' })}>
          {t('addOption')}
        </Button>
        <span className="text-xs text-ink-3">{t('markHint')}</span>
      </div>
    </div>
  );
}
