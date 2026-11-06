import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { createSpeakingQuestion, type TestDraft } from '@/entities/test';
import { Panel } from '@/shared/ui';
import { SpeakingQuestionRow } from './speaking-question-row';

export function SpeakingSection() {
  const t = useTranslations('speaking');
  const { control, getValues } = useFormContext<TestDraft>();
  const { fields, append, move, remove } = useFieldArray({ control, name: 'speaking', keyName: 'fieldKey' });

  const add = () => append(createSpeakingQuestion(fields.length + 1, getValues('speaking').at(-1)?.part));

  return (
    <Panel title={t('title', { count: fields.length })}>
      <div className="flex flex-col gap-3">
        {fields.map((field, i) => (
          <SpeakingQuestionRow key={field.fieldKey} index={i} count={fields.length} onMove={(to) => move(i, to)} onRemove={() => remove(i)} />
        ))}
        <div>
          <Button variant="secondary" size="xs" icon={<Plus size={14} />} onClick={add}>
            {t('add')}
          </Button>
        </div>
      </div>
    </Panel>
  );
}
