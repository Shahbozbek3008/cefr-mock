import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Tag } from '@cefr/ui/components/tag';
import { completedCount, type QuestionSection, type TestDraft } from '@/entities/test';

export function PartProgress({ section, partIndex }: { section: QuestionSection; partIndex: number }) {
  const t = useTranslations('parts');
  const { control } = useFormContext<TestDraft>();
  const [questions, choices] = useWatch({ control, name: [`${section}.${partIndex}.questions`, `${section}.${partIndex}.choices`] });
  const done = completedCount(questions, choices);
  const total = questions.length;

  return (
    <Tag tone={total > 0 && done === total ? 'green' : 'sunken'} size="sm">
      {t('progress', { done, total })}
    </Tag>
  );
}
