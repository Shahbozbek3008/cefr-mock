import { Ref, memo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useAnswer, useAttemptStore } from '../model/store';
import { makeStyles, radius, space, type, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type GapInputProps = {
  questionId: string;
  number: number;
  variant?: 'inline' | 'field';
  onFocus?: (id: string) => void;
  ref?: Ref<TextInput>;
};

export const GapInput = memo<GapInputProps>(({ questionId, number, variant = 'inline', onFocus, ref }) => {
  const styles = useStyles();
  const { colors, elevation } = useTheme();
  const value = useAnswer(questionId);
  const setAnswer = useAttemptStore((s) => s.setAnswer);
  const [focused, setFocused] = useState(false);

  const filled = value.trim() !== '';
  const inline = variant === 'inline';
  const numberColor = focused ? colors.data : filled ? colors.dataSoft : colors.textTertiary;

  return (
    <View
      style={[
        inline ? styles.inline : styles.field,
        focused ? [styles.focused, elevation.focusRing] : filled ? styles.filled : styles.empty,
      ]}
    >
      <Text variant="monoNano" color={numberColor}>
        {String(number).padStart(2, '0')}
      </Text>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(text) => setAnswer(questionId, text)}
        onFocus={() => {
          setFocused(true);
          onFocus?.(questionId);
        }}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        allowFontScaling={false}
        placeholder={inline ? undefined : 'Javobingiz'}
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.selectedBorder}
        cursorColor={colors.selectedBorder}
        accessibilityLabel={`Savol ${number} javobi`}
        style={[styles.input, filled && !focused && styles.inputFilled]}
      />
    </View>
  );
});

GapInput.displayName = 'GapInput';

const useStyles = makeStyles(({ colors }) => ({
  inline: {
    width: 124,
    height: 40,
    borderRadius: radius.input,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
    paddingHorizontal: space[2.5],
  },
  field: {
    height: 52,
    borderRadius: radius.input,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[3.5],
  },
  empty: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.selectedBg,
    borderWidth: 1,
    borderColor: colors.dataMuted,
  },
  focused: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
  input: {
    ...type.label,
    flex: 1,
    color: colors.text,
    padding: 0,
  },
  inputFilled: {
    ...type.labelMedium,
    color: colors.selectedText,
  },
}));
