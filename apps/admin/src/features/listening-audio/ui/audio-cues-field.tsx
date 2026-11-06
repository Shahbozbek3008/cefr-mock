import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Field, TextInput } from '@cefr/ui/components/field';
import type { AudioCues, TestDraft } from '@/entities/test';
import { Disclosure } from '@/shared/ui';

const withCue = (cues: AudioCues, number: number, value: string): AudioCues => {
  const { [number]: _removed, ...rest } = cues;
  return value === '' ? rest : { ...rest, [number]: Number(value) };
};

export function AudioCuesField({ partIndex }: { partIndex: number }) {
  const t = useTranslations('audio');
  const { control } = useFormContext<TestDraft>();
  const questions = useWatch({ control, name: `listening.${partIndex}.questions` });

  if (questions.length === 0) return null;

  return (
    <Disclosure summary={t('cues')}>
      <Controller
        control={control}
        name={`listening.${partIndex}.audioAt`}
        render={({ field }) => (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {questions.map(({ number }) => {
              const id = `cue-${partIndex}-${number}`;
              return (
                <Field key={number} label={String(number)} htmlFor={id}>
                  <TextInput
                    id={id}
                    size="md"
                    type="number"
                    min={0}
                    value={field.value?.[number] ?? ''}
                    onChange={(event) => field.onChange(withCue(field.value ?? {}, number, event.target.value))}
                  />
                </Field>
              );
            })}
          </div>
        )}
      />
    </Disclosure>
  );
}
