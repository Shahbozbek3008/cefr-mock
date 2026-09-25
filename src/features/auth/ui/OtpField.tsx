import { memo, useCallback, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { makeStyles, radius } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { OTP_LENGTH, sanitizeDigits } from '../model';

export type OtpFieldProps = {
  value: string;
  onChange: (code: string) => void;
  autoFocus?: boolean;
};

export const OtpField = memo<OtpFieldProps>(({ value, onChange, autoFocus = true }) => {
  const styles = useStyles();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const onChangeText = useCallback((text: string) => onChange(sanitizeDigits(text, OTP_LENGTH)), [onChange]);

  const focus = useCallback(() => inputRef.current?.focus(), []);

  return (
    <Pressable onPress={focus} accessibilityRole="none">
      <View style={styles.row}>
        {Array.from({ length: OTP_LENGTH }, (_, index) => {
          const char = value[index];
          const active = focused && index === value.length;

          return (
            <View key={index} style={[styles.cell, char ? styles.filled : styles.empty, active && styles.active]}>
              {char ? <Text variant="monoXl">{char}</Text> : active ? <View style={styles.caret} /> : null}
            </View>
          );
        })}
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={OTP_LENGTH}
        caretHidden
        style={styles.hidden}
      />
    </Pressable>
  );
});

OtpField.displayName = 'OtpField';

const useStyles = makeStyles(({ colors }) => ({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    flex: 1,
    height: 60,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    backgroundColor: colors.surfaceMuted,
  },
  filled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
  caret: {
    width: 1.5,
    height: 26,
    backgroundColor: colors.selectedBorder,
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
}));
