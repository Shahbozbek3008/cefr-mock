import { ReactNode, memo } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { light, radius, size } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type SocialButtonProps = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  tone?: 'light' | 'dark';
};

export const SocialButton = memo<SocialButtonProps>(
  ({ label, icon, onPress, tone = 'light' }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === 'dark' ? styles.dark : styles.light,
        pressed && styles.pressed,
      ]}
    >
      {icon}
      <Text
        variant="labelMedium"
        color={tone === 'dark' ? light.surface : light.text}
      >
        {label}
      </Text>
    </Pressable>
  ),
);

SocialButton.displayName = 'SocialButton';

const base: ViewStyle = {
  height: size.buttonM,
  borderRadius: radius.button,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  paddingHorizontal: 18,
};

const styles = StyleSheet.create({
  button: base,
  light: {
    backgroundColor: light.surface,
    borderWidth: 1,
    borderColor: light.border,
  },
  dark: {
    backgroundColor: light.text,
  },
  pressed: {
    opacity: 0.85,
  },
});
