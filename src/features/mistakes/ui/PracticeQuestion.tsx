import { memo } from 'react';
import { View } from 'react-native';
import type { Question } from '@/entities/test';
import { sectionTitles } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { makeStyles, space } from '@/shared/theme';
import { AnswerOption, Card, ChoiceTile, Tag, Text, TextField } from '@/shared/ui';
import type { PracticeItem } from '../model/practice';

const tfngChoices = ['True', 'False', 'Not given'] as const;

export type PracticeQuestionProps = {
  item: PracticeItem;
  value: string;
  onChange: (value: string) => void;
};

const Inputs = ({ question, value, onChange }: { question: Question } & Omit<PracticeQuestionProps, 'item'>) => {
  const styles = useStyles();
  const { t } = useI18n();

  if (question.kind === 'mcq') {
    return (
      <View style={styles.options}>
        {question.options.map((option) => (
          <AnswerOption
            key={option.key}
            letter={option.key}
            label={option.text}
            state={value === option.key ? 'selected' : 'default'}
            onPress={() => onChange(option.key)}
          />
        ))}
      </View>
    );
  }

  if (question.kind === 'tfng') {
    return (
      <View style={styles.row}>
        {tfngChoices.map((choice) => (
          <ChoiceTile key={choice} label={choice} selected={value === choice} onPress={() => onChange(choice)} />
        ))}
      </View>
    );
  }

  return (
    <TextField
      label={t('review.yourAnswer')}
      value={value}
      onChangeText={onChange}
      placeholder={t('session.answerPlaceholder')}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
};

export const PracticeQuestion = memo<PracticeQuestionProps>(({ item, value, onChange }) => {
  const styles = useStyles();
  const { question } = item;

  return (
    <Card level="strong" style={styles.card}>
      <View style={styles.row}>
        <Tag label={`Q${question.number} · ${sectionTitles[item.section]}`} tone="neutral" size="md" mono />
      </View>
      <Text variant="labelRelaxed">{question.kind === 'gap' ? `${question.prompt} ______` : question.prompt}</Text>
      <Inputs question={question} value={value} onChange={onChange} />
    </Card>
  );
});

PracticeQuestion.displayName = 'PracticeQuestion';

const useStyles = makeStyles(() => ({
  card: {
    padding: space[4],
    gap: space[3.5],
  },
  options: {
    gap: space[2],
  },
  row: {
    flexDirection: 'row',
    gap: space[2],
  },
}));
