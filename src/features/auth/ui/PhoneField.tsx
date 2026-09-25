import { memo, useCallback, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { makeStyles, radius, size, type, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { PHONE_DIGITS, PHONE_PREFIX, formatPhone, sanitizeDigits } from '../model';

export type PhoneFieldProps = {
  value: string;
  onChange: (digits: string) => void;
  error?: string;
};

export const PhoneField = memo<PhoneFieldProps>(({ value, onChange, error }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const onChangeText = useCallback((text: string) => onChange(sanitizeDigits(text, PHONE_DIGITS)), [onChange]);

  const focus = useCallback(() => inputRef.current?.focus(), []);

  const invalid = Boolean(error);

  return (
    <View style={styles.container}>
      <Text variant="bodySm" color={colors.textSecondary}>
        Telefon raqam
      </Text>

      <Pressable onPress={focus} accessibilityRole="none">
        <View style={[styles.field, invalid ? styles.fieldError : focused ? styles.fieldFocused : styles.fieldIdle]}>
          <View style={styles.prefix}>
            <Text variant="monoField">{PHONE_PREFIX}</Text>
          </View>

          <TextInput
            ref={inputRef}
            value={formatPhone(value)}
            onChangeText={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            allowFontScaling={false}
            placeholder="90 123 45 67"
            placeholderTextColor={colors.textTertiary}
            selectionColor={colors.selectedBorder}
            style={styles.input}
          />
        </View>
      </Pressable>

      {error ? (
        <Text variant="caption" color={colors.error.text}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

PhoneField.displayName = 'PhoneField';

const useStyles = makeStyles(({ colors }) => ({
  container: {
    gap: 8,
  },
  field: {
    height: size.fieldL,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  fieldIdle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldFocused: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
  fieldError: {
    backgroundColor: colors.error.bg,
    borderWidth: 1.5,
    borderColor: colors.error[500],
  },
  prefix: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  input: {
    ...type.monoField,
    flex: 1,
    color: colors.text,
    padding: 0,
  },
}));
