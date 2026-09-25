import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAnswer, useAttemptStore } from '../model/store';
import { space } from '@/shared/theme';
import { ChoiceTile } from '@/shared/ui';

const choices = ['True', 'False', 'Not given'] as const;

export const TfngChoices = memo<{ questionId: string }>(({ questionId }) => {
  const value = useAnswer(questionId);
  const setAnswer = useAttemptStore((s) => s.setAnswer);

  return (
    <View style={styles.row}>
      {choices.map((choice) => (
        <ChoiceTile
          key={choice}
          label={choice}
          selected={value === choice}
          onPress={() => setAnswer(questionId, choice)}
        />
      ))}
    </View>
  );
});

TfngChoices.displayName = 'TfngChoices';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[2],
  },
});
