import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { ChoicesField, type TestDraft } from '@/entities/test';
import { MapField } from '@/features/edit-map';
import { PartProgress, QuestionList } from '@/features/edit-questions';
import { ScriptEditor } from '@/features/edit-script';
import { AudioPanel } from '@/features/listening-audio';
import { CollapsiblePanel, Disclosure, FormTextArea, FormTextField, RowActions, SectionTitle } from '@/shared/ui';

type ListeningPartCardProps = {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
};

export function ListeningPartCard({ index, count, onMove, onRemove }: ListeningPartCardProps) {
  const t = useTranslations('parts');
  const { control } = useFormContext<TestDraft>();
  const base = `listening.${index}` as const;
  const [instruction, questions, choices] = useWatch({ control, name: [`${base}.instruction`, `${base}.questions`, `${base}.choices`] });
  const needsChoices = choices.length > 0 || questions.some((question) => question.kind === 'match');

  return (
    <CollapsiblePanel
      title={t('name', { index: index + 1 })}
      meta={<PartProgress section="listening" partIndex={index} />}
      actions={<RowActions index={index} count={count} onMove={onMove} onRemove={onRemove} />}
      defaultOpen={index === 0}
    >
      <div className="flex flex-col gap-6">
        {instruction && <p className="text-sm text-ink-2">{instruction}</p>}

        {needsChoices && (
          <div>
            <SectionTitle hint={t('choicesHint')}>{t('choices')}</SectionTitle>
            <ChoicesField name={`${base}.choices`} />
          </div>
        )}

        <div>
          <SectionTitle>{t('questions')}</SectionTitle>
          <QuestionList section="listening" partIndex={index} />
        </div>

        <div>
          <SectionTitle>{t('audio')}</SectionTitle>
          <AudioPanel partIndex={index} />
        </div>

        <Disclosure summary={t('script')}>
          <p className="mb-2 text-xs text-ink-3">{t('scriptHint')}</p>
          <ScriptEditor partIndex={index} />
        </Disclosure>

        <Disclosure summary={t('settings')}>
          <div className="flex flex-col gap-3">
            <FormTextArea control={control} name={`${base}.instruction`} label={t('instruction')} rows={2} />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormTextField control={control} name={`${base}.emphasis`} label={t('emphasis')} hint={t('emphasisHint')} />
              <FormTextField control={control} name={`${base}.title`} label={t('titleOptional')} />
            </div>
            {!needsChoices && (
              <Disclosure summary={t('choices')}>
                <ChoicesField name={`${base}.choices`} />
              </Disclosure>
            )}
            <MapField partIndex={index} />
          </div>
        </Disclosure>
      </div>
    </CollapsiblePanel>
  );
}
