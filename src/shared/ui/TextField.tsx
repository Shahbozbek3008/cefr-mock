import { ReactNode, Ref, memo, useCallback, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { makeStyles, radius, size, space, type, useTheme } from '../theme';
import { Text } from './Text';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'editable'> & {
  label: string;
  hint?: string;
  error?: string;
  trailing?: ReactNode;
  readOnly?: boolean;
  inputRef?: Ref<TextInput>;
};

export const TextField = memo<TextFieldProps>(
  ({ label, hint, error, trailing, readOnly = false, inputRef, onFocus, onBlur, ...inputProps }) => {
    const styles = useStyles();
    const { colors } = useTheme();
    const localRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState(false);

    const focus = () => {
      if (!readOnly) localRef.current?.focus();
    };

    const setRefs = useCallback(
      (node: TextInput | null) => {
        localRef.current = node;
        if (typeof inputRef === 'function') inputRef(node);
        else if (inputRef) inputRef.current = node;
      },
      [inputRef],
    );

    const state = error ? styles.fieldError : readOnly ? styles.fieldReadOnly : focused ? styles.fieldFocused : null;

    return (
      <View style={styles.container}>
        <Text variant="bodySm" color={colors.textSecondary}>
          {label}
        </Text>
        <Pressable onPress={focus} accessibilityRole="none">
          <View style={[styles.field, state]}>
            <TextInput
              {...inputProps}
              ref={setRefs}
              editable={!readOnly}
              accessibilityLabel={label}
              onFocus={(event) => {
                setFocused(true);
                onFocus?.(event);
              }}
              onBlur={(event) => {
                setFocused(false);
                onBlur?.(event);
              }}
              placeholderTextColor={colors.textTertiary}
              selectionColor={colors.selectedBorder}
              style={[styles.input, readOnly && { color: colors.textSecondary }]}
            />
            {trailing}
          </View>
        </Pressable>
        {error || hint ? (
          <Text variant="caption" color={error ? colors.error.text : colors.textTertiary}>
            {error ?? hint}
          </Text>
        ) : null}
      </View>
    );
  },
);

TextField.displayName = 'TextField';

const useStyles = makeStyles(({ colors }) => ({
  container: {
    gap: space[2],
  },
  field: {
    height: size.fieldL,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[4],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldFocused: {
    borderWidth: 1.5,
    borderColor: colors.selectedBorder,
  },
  fieldReadOnly: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.hairlineSoft,
  },
  fieldError: {
    backgroundColor: colors.error.bg,
    borderWidth: 1.5,
    borderColor: colors.error[500],
  },
  input: {
    ...type.body,
    flex: 1,
    color: colors.text,
    padding: 0,
  },
}));
