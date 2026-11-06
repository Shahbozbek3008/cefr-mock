import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { createQuestion, nextQuestionNumber, type QuestionSection, type TestDraft } from '@/entities/test';
import { QuestionRow } from './question-row';

type QuestionListProps = {
  section: QuestionSection;
  partIndex: number;
};

export function QuestionList({ section, partIndex }: QuestionListProps) {
  const t = useTranslations('question');
  const { control, getValues } = useFormContext<TestDraft>();
  const name = `${section}.${partIndex}.questions` as const;
  const { fields, append, move, remove } = useFieldArray({ control, name, keyName: 'fieldKey' });

  const add = () => {
    const number = nextQuestionNumber(getValues(section));
    const lastKind = getValues(name).at(-1)?.kind;
    append(createQuestion(section, number, lastKind));
  };

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, i) => (
        <QuestionRow
          key={field.fieldKey}
          path={`${name}.${i}`}
          choicesPath={`${section}.${partIndex}.choices`}
          index={i}
          count={fields.length}
          onMove={(to) => move(i, to)}
          onRemove={() => remove(i)}
        />
      ))}
      <div>
        <Button variant="secondary" size="xs" icon={<Plus size={14} />} onClick={add}>
          {t('add')}
        </Button>
      </div>
    </div>
  );
}
