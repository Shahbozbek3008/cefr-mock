import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { createListeningPart, type TestDraft } from '@/entities/test';
import { ListeningPartCard } from './listening-part-card';

export function ListeningSection() {
  const t = useTranslations('parts');
  const { control } = useFormContext<TestDraft>();
  const { fields, append, move, remove } = useFieldArray({ control, name: 'listening', keyName: 'fieldKey' });

  const removePart = (index: number) => {
    if (window.confirm(t('confirmRemove', { index: index + 1 }))) remove(index);
  };

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field, i) => (
        <ListeningPartCard key={field.fieldKey} index={i} count={fields.length} onMove={(to) => move(i, to)} onRemove={() => removePart(i)} />
      ))}
      <div>
        <Button variant="secondary" size="sm" icon={<Plus size={16} />} onClick={() => append(createListeningPart(fields.length + 1))}>
          {t('add')}
        </Button>
      </div>
    </div>
  );
}
