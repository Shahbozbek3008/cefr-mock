import { memo } from 'react';
import { StyleSheet, Text as RNText, TextProps as RNTextProps } from 'react-native';
import { light, type, TypeToken } from '../theme';

export type TextProps = RNTextProps & {
  variant?: TypeToken;
  color?: string;
  center?: boolean;
  tabular?: boolean;
};

export const Text = memo<TextProps>(
  ({ variant = 'body', color = light.text, center, tabular, style, ...rest }) => (
    <RNText
      allowFontScaling={false}
      style={[
        type[variant],
        { color },
        center && styles.center,
        tabular && styles.tabular,
        style,
      ]}
      {...rest}
    />
  ),
);

Text.displayName = 'Text';

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  tabular: { fontVariant: ['tabular-nums'] },
});
