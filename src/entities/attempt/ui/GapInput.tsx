import { Ref, memo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useAnswer, useAttemptStore } from '../model/store';
import { elevation, light, radius, space, type } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type GapInputProps = {
  questionId: string;
  number: number;
  variant?: 'inline' | 'field';
  onFocus?: (id: string) => void;
  ref?: Ref<TextInput>;
};

export const GapInput = memo<GapInputProps>(({ questionId, number, variant = 'inline', onFocus, ref }) => {
  const value = useAnswer(questionId);
  const setAnswer = useAttemptStore((s) => s.setAnswer);
  const [focused, setFocused] = useState(false);

  const filled = value.trim() !== '';
  const inline = variant === 'inline';
  const numberColor = focused ? light.data : filled ? light.dataSoft : light.textTertiary;

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
        placeholderTextColor={light.textTertiary}
        selectionColor={light.selectedBorder}
        cursorColor={light.selectedBorder}
        accessibilityLabel={`Savol ${number} javobi`}
        style={[styles.input, filled && !focused && styles.inputFilled]}
      />
    </View>
  );
});

GapInput.displayName = 'GapInput';

const styles = StyleSheet.create({
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
    backgroundColor: light.bg,
    borderWidth: 1,
    borderColor: light.border,
  },
  filled: {
    backgroundColor: light.selectedBg,
    borderWidth: 1,
    borderColor: light.dataMuted,
  },
  focused: {
    backgroundColor: light.surface,
    borderWidth: 1.5,
    borderColor: light.selectedBorder,
  },
  input: {
    ...type.label,
    flex: 1,
    color: light.text,
    padding: 0,
  },
  inputFilled: {
    ...type.labelMedium,
    color: light.selectedText,
  },
});
