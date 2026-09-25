import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Question } from '@/entities/test';
import { space } from '@/shared/theme';
import { QuestionCell } from './QuestionCell';

const SLOTS = 8;

export type QuestionNavigatorProps = {
  questions: Question[];
  currentId: string;
  onSelect: (id: string) => void;
};

export const QuestionNavigator = memo<QuestionNavigatorProps>(({ questions, currentId, onSelect }) => (
  <View style={styles.row}>
    {questions.map((q) => (
      <QuestionCell key={q.id} id={q.id} number={q.number} current={q.id === currentId} onPress={onSelect} />
    ))}
    {Array.from({ length: Math.max(0, SLOTS - questions.length) }, (_, index) => (
      <View key={index} style={styles.spacer} />
    ))}
  </View>
));

QuestionNavigator.displayName = 'QuestionNavigator';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space[1.5],
  },
  spacer: {
    flex: 1,
  },
});
