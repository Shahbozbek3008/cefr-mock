import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Inset } from '@cefr/ui/components/card';
import type { TestDraft } from '@/entities/test';
import { FormNumberField, FormTextArea, FormTextField, RowActions } from '@/shared/ui';

type SpeakingQuestionRowProps = {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
};

export function SpeakingQuestionRow({ index, count, onMove, onRemove }: SpeakingQuestionRowProps) {
  const t = useTranslations('speaking');
  const { control } = useFormContext<TestDraft>();
  const base = `speaking.${index}` as const;

  return (
    <Inset className="p-4">
      <div className="grid items-end gap-3 sm:grid-cols-[100px_1fr_120px_120px_auto]">
        <FormTextField control={control} name={`${base}.part`} label={t('part')} hint={t('partHint')} />
        <FormTextField control={control} name={`${base}.image`} label={t('image')} hint={t('imageHint')} />
        <FormNumberField control={control} name={`${base}.prepSec`} label={t('prep')} min={0} />
        <FormNumberField control={control} name={`${base}.answerSec`} label={t('answer')} min={0} />
        <RowActions index={index} count={count} onMove={onMove} onRemove={onRemove} />
      </div>
      <FormTextArea control={control} name={`${base}.prompt`} label={t('prompt', { index: index + 1 })} rows={2} className="mt-3" />
    </Inset>
  );
}
