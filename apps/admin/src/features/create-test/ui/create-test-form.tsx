import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { RadioCardGroup, RadioDot } from '@cefr/ui/components/controls';
import type { TestDraft, TestRow } from '@/entities/test';
import { ErrorNotice, FormSelect, Panel } from '@/shared/ui';
import { CREATE_MODES, buildDraft, type CreateMode, type CreateTestValues } from '../model/build-draft';

type CreateTestFormProps = {
  tests: TestRow[];
  nextNumber: number;
  onCreate: (draft: TestDraft) => void;
};

const isCreateMode = (value: string): value is CreateMode => (CREATE_MODES as readonly string[]).includes(value);

export function CreateTestForm({ tests, nextNumber, onCreate }: CreateTestFormProps) {
  const t = useTranslations('createTest');
  const hasSource = tests.length > 0;
  const [failure, setFailure] = useState<unknown>(null);
  const { control, handleSubmit, formState } = useForm<CreateTestValues>({
    defaultValues: { mode: hasSource ? 'template' : 'blank', sourceId: tests[0]?.id ?? '' },
  });
  const mode = useWatch({ control, name: 'mode' });
  const modes = CREATE_MODES.filter((value) => hasSource || value === 'blank').map((value) => ({ value }));
  const sourceOptions = tests.map((test) => ({ value: test.id, label: `${test.title} (${test.id})` }));

  const submit = handleSubmit(async (values) => {
    setFailure(null);
    try {
      onCreate(await buildDraft(values, nextNumber));
    } catch (error) {
      setFailure(error);
    }
  });

  return (
    <Panel title={t('title', { number: nextNumber })}>
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <Controller
          control={control}
          name="mode"
          render={({ field }) => (
            <RadioCardGroup
              items={modes}
              value={field.value}
              onValueChange={(value) => isCreateMode(value) && field.onChange(value)}
              label={t('modeLabel')}
              className="grid gap-2 sm:grid-cols-3"
              itemClassName="flex items-start gap-3 rounded-card-sm bg-surface p-4 shadow-inset hover:translate-y-0 data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--green-500)]"
              renderItem={(item) => (
                <>
                  <RadioDot size={18} className="mt-0.5" />
                  <span className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-ink">{t(`modes.${item.value}.title`)}</span>
                    <span className="text-xs text-ink-2">{t(`modes.${item.value}.text`)}</span>
                  </span>
                </>
              )}
            />
          )}
        />

        {mode !== 'blank' && (
          <FormSelect control={control} name="sourceId" label={t('source')} hint={t('sourceHint')} options={sourceOptions} className="sm:max-w-md" />
        )}

        <ErrorNotice error={failure} />

        <div>
          <Button type="submit" size="sm" icon={<ArrowRight size={16} />} loading={formState.isSubmitting}>
            {t('continue')}
          </Button>
        </div>
      </form>
    </Panel>
  );
}
