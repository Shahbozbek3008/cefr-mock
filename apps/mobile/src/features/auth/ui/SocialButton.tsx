import { ReactNode, memo } from 'react';
import { ActivityIndicator, Pressable, ViewStyle } from 'react-native';
import { makeStyles, radius, size, useTheme } from '@/shared/theme';
import { Text } from '@/shared/ui';

export type SocialButtonProps = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
  tone?: 'light' | 'dark';
  loading?: boolean;
};

export const SocialButton = memo<SocialButtonProps>(({ label, icon, onPress, tone = 'light', loading = false }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const color = tone === 'dark' ? colors.surface : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: loading, disabled: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.button, tone === 'dark' ? styles.dark : styles.light, pressed && styles.pressed]}
    >
      {loading ? <ActivityIndicator size="small" color={color} /> : icon}
      <Text variant="labelMedium" color={color}>
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
