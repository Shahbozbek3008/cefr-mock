import { memo } from 'react';
import { Pressable, View } from 'react-native';
import type { Choice } from '@/entities/test';
import { makeStyles, radius, space, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { useAnswer, useAttemptStore } from '../model/store';

export type MatchChipsProps = {
  questionId: string;
  choices: Choice[];
  onAnswer?: (id: string) => void;
};

export const MatchChips = memo<MatchChipsProps>(({ questionId, choices, onAnswer }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const value = useAnswer(questionId);
  const setAnswer = useAttemptStore((s) => s.setAnswer);

  return (
    <View style={styles.row}>
      {choices.map((choice) => {
        const selected = value === choice.key;
        return (
          <Pressable
            key={choice.key}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${choice.key}. ${choice.text}`}
            onPress={() => {
              setAnswer(questionId, choice.key);
              onAnswer?.(questionId);
            }}
            style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
          >
            <Text variant="monoSmMedium" color={selected ? colors.onAction : colors.textStrong}>
              {choice.key}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

MatchChips.displayName = 'MatchChips';

const CHIP = 38;

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[1.5],
  },
  chip: {
    width: CHIP,
    height: CHIP,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.action,
    borderColor: colors.action,
  },
  pressed: {
    opacity: 0.6,
  },
}));
