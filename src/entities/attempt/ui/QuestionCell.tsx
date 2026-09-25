import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAnswer, useIsFlagged } from '../model/store';
import { elevation, light, radius } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type QuestionCellProps = {
  id: string;
  number: number;
  current: boolean;
  size?: 'sm' | 'md';
  onPress: (id: string) => void;
};

export const QuestionCell = memo<QuestionCellProps>(({ id, number, current, size = 'sm', onPress }) => {
  const answered = useAnswer(id).trim() !== '';
  const flagged = useIsFlagged(id);
  const color = current ? light.onAction : answered ? light.selectedText : light.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Savol ${number}`}
      accessibilityState={{ selected: current }}
      onPress={() => onPress(id)}
      style={[
        size === 'sm' ? styles.sm : styles.md,
        current ? [styles.current, elevation.actionXs] : answered ? styles.answered : styles.empty,
      ]}
    >
      <Text variant={size === 'sm' ? 'monoSm' : 'monoCallout'} color={color}>
        {String(number).padStart(2, '0')}
      </Text>
      {flagged ? <View style={styles.flag} /> : null}
    </Pressable>
  );
});

QuestionCell.displayName = 'QuestionCell';

const styles = StyleSheet.create({
  sm: {
    flex: 1,
    height: 34,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: {
    width: 40,
    height: 40,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    backgroundColor: light.action,
  },
  answered: {
    backgroundColor: light.chipActiveBg,
  },
  empty: {
    backgroundColor: light.surface,
    borderWidth: 1,
    borderColor: light.border,
  },
  flag: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: light.warning[500],
    borderWidth: 2,
    borderColor: light.surface,
  },
});
