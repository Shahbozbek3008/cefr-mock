import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { createReadingPart, type TestDraft } from '@/entities/test';
import { ReadingPartCard } from './reading-part-card';

export function ReadingSection() {
  const t = useTranslations('parts');
  const { control } = useFormContext<TestDraft>();
  const { fields, append, move, remove } = useFieldArray({ control, name: 'reading', keyName: 'fieldKey' });

  const removePart = (index: number) => {
    if (window.confirm(t('confirmRemove', { index: index + 1 }))) remove(index);
  };

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field, i) => (
        <ReadingPartCard key={field.fieldKey} index={i} count={fields.length} onMove={(to) => move(i, to)} onRemove={() => removePart(i)} />
      ))}
      <div>
        <Button variant="secondary" size="sm" icon={<Plus size={16} />} onClick={() => append(createReadingPart(fields.length + 1))}>
          {t('add')}
        </Button>
      </div>
    </div>
  );
}
