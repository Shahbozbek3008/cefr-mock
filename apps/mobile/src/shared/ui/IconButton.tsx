import { ReactNode, memo } from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { hitSlop, makeStyles, radius, size } from '../theme';

export type IconButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  shape?: 'circle' | 'square';
  tone?: 'surface' | 'muted' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
};

export const IconButton = memo<IconButtonProps>(
  ({ children, onPress, accessibilityLabel, shape = 'circle', tone = 'surface', disabled = false, style }) => {
    const styles = useStyles();

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        hitSlop={hitSlop}
        onPress={onPress}
        style={({ pressed }) => [
          shape === 'circle' ? styles.circle : styles.square,
          styles[tone],
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  },
);

IconButton.displayName = 'IconButton';

const useStyles = makeStyles(({ colors }) => ({
  circle: {
    width: size.iconButton,
    height: size.iconButton,
    borderRadius: size.iconButton / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: size.buttonM,
    height: size.buttonM,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  muted: {
    backgroundColor: colors.bg,
  },
  pressed: {
    opacity: 0.7,
  },
}));
