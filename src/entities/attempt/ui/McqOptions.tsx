import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAnswer, useAttemptStore } from '../model/store';
import type { McqQuestion as McqQuestionModel } from '@/entities/test';
import { space } from '@/shared/theme';
import { AnswerOption } from '@/shared/ui';

export type McqOptionsProps = {
  question: McqQuestionModel;
  onAnswer?: (id: string) => void;
};

export const McqOptions = memo<McqOptionsProps>(({ question, onAnswer }) => {
  const value = useAnswer(question.id);
  const setAnswer = useAttemptStore((s) => s.setAnswer);

  const select = useCallback(
    (key: string) => {
      setAnswer(question.id, key);
      onAnswer?.(question.id);
    },
    [onAnswer, question.id, setAnswer],
  );

  return (
    <View style={styles.options}>
      {question.options.map((option) => (
        <AnswerOption
          key={option.key}
          letter={option.key}
          label={option.text}
          state={value === option.key ? 'selected' : 'default'}
          onPress={() => select(option.key)}
        />
      ))}
    </View>
  );
});

McqOptions.displayName = 'McqOptions';

const styles = StyleSheet.create({
  options: {
    gap: space[2],
  },
});
