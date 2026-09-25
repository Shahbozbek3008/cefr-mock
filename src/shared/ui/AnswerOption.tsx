import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { Colors, makeStyles, palette, radius, space, useTheme } from '../theme';
import { Text } from './Text';

export type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';

export type AnswerOptionProps = {
  letter: string;
  label: string;
  state?: AnswerState;
  onPress?: () => void;
};

const toneFor = (colors: Colors, state: AnswerState) =>
  ({
    default: { badgeBg: colors.surfaceMuted, badgeFg: colors.textSecondary, label: colors.text },
    selected: { badgeBg: colors.action, badgeFg: colors.onAction, label: colors.selectedText },
    correct: { badgeBg: colors.success[500], badgeFg: palette.neutral.white, label: colors.success.text },
    incorrect: { badgeBg: colors.error[500], badgeFg: palette.neutral.white, label: colors.error.text },
  })[state];

export const AnswerOption = memo<AnswerOptionProps>(({ letter, label, state = 'default', onPress }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const tone = toneFor(colors, state);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: state === 'selected', disabled: !onPress }}
      accessibilityLabel={`${letter}. ${label}`}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.option, styles[state]]}
    >
      <View style={[styles.badge, { backgroundColor: tone.badgeBg }]}>
        {state === 'correct' ? (
          <Check size={13} color={tone.badgeFg} strokeWidth={3} />
        ) : state === 'incorrect' ? (
          <X size={13} color={tone.badgeFg} strokeWidth={3} />
        ) : (
          <Text variant="monoSm" color={tone.badgeFg}>
            {letter}
          </Text>
        )}
      </View>
      <Text variant={state === 'selected' ? 'labelMedium' : 'label'} color={tone.label} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
});

AnswerOption.displayName = 'AnswerOption';

const useStyles = makeStyles(({ colors }) => ({
  option: {
    minHeight: 52,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[3.5],
    paddingVertical: space[2.5],
  },
  default: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.selectedBg,
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
  correct: {
    backgroundColor: colors.success.bg,
    borderWidth: 1.5,
    borderColor: colors.success[500],
  },
  incorrect: {
    backgroundColor: colors.error.bg,
    borderWidth: 1.5,
    borderColor: colors.error[500],
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
}));
