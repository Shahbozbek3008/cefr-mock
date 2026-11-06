import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import type { TestDraft } from '@/entities/test';
import { FormNumberField, FormTextArea, FormTextField, Panel, RowActions } from '@/shared/ui';

type WritingTaskCardProps = {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
};

export function WritingTaskCard({ index, count, onMove, onRemove }: WritingTaskCardProps) {
  const t = useTranslations('writing');
  const { control } = useFormContext<TestDraft>();
  const base = `writing.${index}` as const;
  const label = useWatch({ control, name: `${base}.label` });

  return (
    <Panel title={label || t('task', { index: index + 1 })} actions={<RowActions index={index} count={count} onMove={onMove} onRemove={onRemove} />}>
      <div className="grid gap-3 sm:grid-cols-5">
        <FormTextField control={control} name={`${base}.label`} label={t('name')} />
        <FormTextField control={control} name={`${base}.kind`} label={t('kind')} hint={t('kindHint')} />
        <FormNumberField control={control} name={`${base}.minWords`} label={t('minWords')} min={0} />
        <FormNumberField control={control} name={`${base}.targetWords`} label={t('targetWords')} min={0} />
        <FormNumberField control={control} name={`${base}.weight`} label={t('weight')} hint={t('weightHint')} min={0} step={0.5} optional />
        <FormTextArea control={control} name={`${base}.context`} label={t('context')} hint={t('contextHint')} rows={4} className="sm:col-span-5" />
        <FormTextArea control={control} name={`${base}.prompt`} label={t('prompt')} rows={5} className="sm:col-span-5" />
      </div>
    </Panel>
  );
}
