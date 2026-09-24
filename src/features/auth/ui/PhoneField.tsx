import { memo, useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { light, radius, size, type } from '@/shared/theme';
import { Text } from '@/shared/ui';
import { PHONE_DIGITS, PHONE_PREFIX, formatPhone, sanitizeDigits } from '../model';

export type PhoneFieldProps = {
  value: string;
  onChange: (digits: string) => void;
  error?: string;
};

export const PhoneField = memo<PhoneFieldProps>(({ value, onChange, error }) => {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const onChangeText = useCallback(
    (text: string) => onChange(sanitizeDigits(text, PHONE_DIGITS)),
    [onChange],
  );

  const focus = useCallback(() => inputRef.current?.focus(), []);

  const invalid = Boolean(error);

  return (
    <View style={styles.container}>
      <Text variant="bodySm" color={light.textSecondary}>
        Telefon raqam
      </Text>

      <Pressable onPress={focus} accessibilityRole="none">
        <View
          style={[
            styles.field,
            invalid ? styles.fieldError : focused ? styles.fieldFocused : styles.fieldIdle,
          ]}
        >
          <View style={styles.prefix}>
            <Text variant="monoField">
              {PHONE_PREFIX}
            </Text>
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
            placeholderTextColor={light.textTertiary}
            selectionColor={light.selectedBorder}
            style={styles.input}
          />
        </View>
      </Pressable>

      {error ? (
        <Text variant="caption" color={light.error.text}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

PhoneField.displayName = 'PhoneField';

const styles = StyleSheet.create({
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
    backgroundColor: light.surface,
    borderWidth: 1,
    borderColor: light.border,
  },
  fieldFocused: {
    backgroundColor: light.surface,
    borderWidth: 1.5,
    borderColor: light.selectedBorder,
  },
  fieldError: {
    backgroundColor: light.error.bg,
    borderWidth: 1.5,
    borderColor: light.error[500],
  },
  prefix: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: light.border,
  },
  input: {
    ...type.monoField,
    flex: 1,
    color: light.text,
    padding: 0,
  },
});
