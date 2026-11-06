import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { createWritingTask, type TestDraft } from '@/entities/test';
import { WritingTaskCard } from './writing-task-card';

export function WritingSection() {
  const t = useTranslations('writing');
  const { control } = useFormContext<TestDraft>();
  const { fields, append, move, remove } = useFieldArray({ control, name: 'writing', keyName: 'fieldKey' });

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field, i) => (
        <WritingTaskCard key={field.fieldKey} index={i} count={fields.length} onMove={(to) => move(i, to)} onRemove={() => remove(i)} />
      ))}
      <div>
        <Button variant="secondary" size="sm" icon={<Plus size={16} />} onClick={() => append(createWritingTask(fields.length + 1))}>
          {t('add')}
        </Button>
      </div>
    </div>
  );
}
