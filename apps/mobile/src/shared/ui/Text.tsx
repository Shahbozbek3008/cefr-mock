import { memo } from 'react';
import { StyleSheet, Text as RNText, TextProps as RNTextProps } from 'react-native';
import { type, TypeToken, useTheme } from '../theme';

export type TextProps = RNTextProps & {
  variant?: TypeToken;
  color?: string;
  center?: boolean;
  tabular?: boolean;
};

export const Text = memo<TextProps>(({ variant = 'body', color, center, tabular, style, ...rest }) => {
  const { colors } = useTheme();

  return (
    <RNText
      allowFontScaling={false}
      style={[
        type[variant],
        { color: color ?? colors.text },
        center && styles.center,
        tabular && styles.tabular,
        style,
      ]}
      {...rest}
    />
  );
});

Text.displayName = 'Text';

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  tabular: { fontVariant: ['tabular-nums'] },
});
