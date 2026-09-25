import { memo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { light, palette, radius, space } from '../theme';
import { Text } from './Text';

export type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';

export type AnswerOptionProps = {
  letter: string;
  label: string;
  state?: AnswerState;
  onPress?: () => void;
};

const surfaces: Record<AnswerState, ViewStyle> = {
  default: { backgroundColor: light.surface, borderWidth: 1, borderColor: light.border },
  selected: { backgroundColor: light.selectedBg, borderWidth: 1.5, borderColor: light.selectedBorder },
  correct: { backgroundColor: light.success.bg, borderWidth: 1.5, borderColor: light.success[500] },
  incorrect: { backgroundColor: light.error.bg, borderWidth: 1.5, borderColor: light.error[500] },
};

const badges: Record<AnswerState, { bg: string; fg: string }> = {
  default: { bg: light.surfaceMuted, fg: light.textSecondary },
  selected: { bg: light.action, fg: light.onAction },
  correct: { bg: light.success[500], fg: palette.neutral.white },
  incorrect: { bg: light.error[500], fg: palette.neutral.white },
};

const labelColors: Record<AnswerState, string> = {
  default: light.text,
  selected: light.selectedText,
  correct: light.success.text,
  incorrect: light.error.text,
};

export const AnswerOption = memo<AnswerOptionProps>(({ letter, label, state = 'default', onPress }) => {
  const badge = badges[state];

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: state === 'selected', disabled: !onPress }}
      accessibilityLabel={`${letter}. ${label}`}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.option, surfaces[state]]}
    >
      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        {state === 'correct' ? (
          <Check size={13} color={badge.fg} strokeWidth={3} />
        ) : state === 'incorrect' ? (
          <X size={13} color={badge.fg} strokeWidth={3} />
        ) : (
          <Text variant="monoSm" color={badge.fg}>
            {letter}
          </Text>
        )}
      </View>
      <Text variant={state === 'selected' ? 'labelMedium' : 'label'} color={labelColors[state]} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
});

AnswerOption.displayName = 'AnswerOption';

const styles = StyleSheet.create({
  option: {
    minHeight: 52,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[3.5],
    paddingVertical: space[2.5],
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: radius.tag,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
});
