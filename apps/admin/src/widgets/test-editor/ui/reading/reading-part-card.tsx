import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { ChoicesField, type TestDraft } from '@/entities/test';
import { PartProgress, QuestionList } from '@/features/edit-questions';
import { CollapsiblePanel, Disclosure, FormTextArea, FormTextField, RowActions, SectionTitle } from '@/shared/ui';
import { PassageField } from './passage-field';

type ReadingPartCardProps = {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
};

export function ReadingPartCard({ index, count, onMove, onRemove }: ReadingPartCardProps) {
  const t = useTranslations('parts');
  const { control } = useFormContext<TestDraft>();
  const base = `reading.${index}` as const;
  const [title, instruction, questions, choices] = useWatch({
    control,
    name: [`${base}.title`, `${base}.instruction`, `${base}.questions`, `${base}.choices`],
  });
  const needsChoices = choices.length > 0 || questions.some((question) => question.kind === 'match');

  return (
    <CollapsiblePanel
      title={title || t('name', { index: index + 1 })}
      meta={<PartProgress section="reading" partIndex={index} />}
      actions={<RowActions index={index} count={count} onMove={onMove} onRemove={onRemove} />}
      defaultOpen={index === 0}
    >
      <div className="flex flex-col gap-6">
        {instruction && <p className="text-sm text-ink-2">{instruction}</p>}

        <div>
          <SectionTitle>{t('passage')}</SectionTitle>
          <PassageField partIndex={index} />
        </div>

        {needsChoices && (
          <div>
            <SectionTitle hint={t('choicesHint')}>{t('choices')}</SectionTitle>
            <ChoicesField name={`${base}.choices`} />
          </div>
        )}

        <div>
          <SectionTitle>{t('questions')}</SectionTitle>
          <QuestionList section="reading" partIndex={index} />
        </div>

        <Disclosure summary={t('settings')}>
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-[240px_1fr]">
              <FormTextField control={control} name={`${base}.title`} label={t('title')} />
              <FormTextArea control={control} name={`${base}.instruction`} label={t('instruction')} rows={2} />
            </div>
            {!needsChoices && (
              <Disclosure summary={t('choices')}>
                <ChoicesField name={`${base}.choices`} />
              </Disclosure>
            )}
          </div>
        </Disclosure>
      </div>
    </CollapsiblePanel>
  );
}
