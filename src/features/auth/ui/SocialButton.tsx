import { ReactNode, memo } from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { makeStyles, radius, size, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type SocialButtonProps = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  tone?: 'light' | 'dark';
};

export const SocialButton = memo<SocialButtonProps>(({ label, icon, onPress, tone = 'light' }) => {
  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, tone === 'dark' ? styles.dark : styles.light, pressed && styles.pressed]}
    >
      {icon}
      <Text variant="labelMedium" color={tone === 'dark' ? colors.surface : colors.text}>
        {label}
      </Text>
    </Pressable>
  );
});

SocialButton.displayName = 'SocialButton';

const base: ViewStyle = {
  height: size.buttonM,
  borderRadius: radius.button,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  paddingHorizontal: 18,
};

const useStyles = makeStyles(({ colors }) => ({
  button: base,
  light: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dark: {
    backgroundColor: colors.text,
  },
  pressed: {
    opacity: 0.85,
  },
}));
