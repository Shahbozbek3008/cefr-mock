import { useFormContext } from 'react-hook-form';
import { useFormatter, useTranslations } from 'use-intl';
import { defaultTitleFor, testIdFor, type TestDraft } from '@/entities/test';
import { Disclosure, FormCheckbox, FormNumberField, FormSelect, FormTextField, Panel } from '@/shared/ui';

const MONTH_INDEXES = Array.from({ length: 12 }, (_, i) => i);

const toLowerCase = (value: string) => value.toLowerCase();

const useNumberSync = (isNew: boolean) => {
  const { getValues, setValue } = useFormContext<TestDraft>();

  return (next: number | undefined, previous: unknown) => {
    if (next === undefined || !Number.isFinite(next) || typeof previous !== 'number') return;
    const options = { shouldDirty: true };
    if (isNew && getValues('id') === testIdFor(previous)) setValue('id', testIdFor(next), options);
    if (getValues('title') === defaultTitleFor(previous)) setValue('title', defaultTitleFor(next), options);
  };
};

export function MetaSection({ isNew }: { isNew: boolean }) {
  const t = useTranslations('meta');
  const format = useFormatter();
  const { control } = useFormContext<TestDraft>();
  const syncNumber = useNumberSync(isNew);
  const monthOptions = MONTH_INDEXES.map((month) => ({ value: String(month), label: format.dateTime(new Date(2000, month, 1), { month: 'long' }) }));

  return (
    <Panel title={t('heading')}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormTextField control={control} name="title" label={t('title')} className="sm:col-span-2" />
        <FormNumberField control={control} name="number" label={t('number')} min={1} onValueChange={syncNumber} />
        <div className="grid grid-cols-2 gap-3">
          <FormSelect control={control} name="formatMonth" label={t('formatMonth')} options={monthOptions} parse={Number} />
          <FormNumberField control={control} name="formatYear" label={t('formatYear')} />
        </div>
        <div className="flex flex-col gap-3 sm:col-span-2">
          <FormCheckbox control={control} name="isPro" label={t('pro')} />
          <FormCheckbox control={control} name="isNew" label={t('isNew')} />
        </div>
        <div className="sm:col-span-2">
          <Disclosure summary={t('advanced')}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormTextField control={control} name="id" label={t('id')} hint={isNew ? t('idHintNew') : t('idHintLocked')} readOnly={!isNew} transform={toLowerCase} />
              <FormTextField control={control} name="durationLabel" label={t('durationLabel')} hint={t('durationHint')} />
            </div>
          </Disclosure>
        </div>
      </div>
    </Panel>
  );
}
