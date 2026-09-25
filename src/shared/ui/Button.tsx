import { ReactNode, memo, useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Colors, makeStyles, motion, radius, size, space, TypeToken, useTheme } from '../theme';
import { ActionSurface } from './ActionSurface';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'soft' | 'muted' | 'tertiary' | 'destructive';
type Size = 'L' | 'M' | 'S';

export type ButtonProps = {
  label?: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  trailingIcon?: ReactNode;
  trailingText?: string;
  icon?: ReactNode;
  align?: 'between' | 'center' | 'start';
  accessibilityLabel?: string;
  grow?: boolean;
  style?: ViewStyle;
};

const metrics: Record<Size, { height: number; radius: number; padding: number; text: TypeToken }> = {
  L: { height: size.buttonL, radius: radius.lg, padding: space[5.5], text: 'titleSm' },
  M: { height: size.buttonM, radius: radius.button, padding: space[5], text: 'labelMedium' },
  S: { height: 32, radius: radius.sm, padding: space[3], text: 'calloutMedium' },
};

const textColor = (colors: Colors, variant: Variant) =>
  ({
    primary: colors.onAction,
    secondary: colors.text,
    soft: colors.selectedText,
    muted: colors.textStrong,
    tertiary: colors.link,
    destructive: colors.error.text,
  })[variant];

export const Button = memo<ButtonProps>(
  ({
    label,
    onPress,
    variant = 'primary',
    size: sizeKey = 'L',
    loading = false,
    disabled = false,
    trailingIcon,
    trailingText,
    icon,
    align = 'between',
    accessibilityLabel,
    grow = false,
    style,
  }) => {
    const styles = useStyles();
    const { colors, elevation } = useTheme();
    const scale = useSharedValue(1);
    const pressed = useSharedValue(0);
    const inactive = disabled || loading;
    const m = metrics[sizeKey];
    const color = inactive ? colors.disabledText : textColor(colors, variant);
    const iconOnly = icon !== undefined && !label;

    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
    const pressedStyle = useAnimatedStyle(() => ({ opacity: pressed.value }));

    const onPressIn = useCallback(() => {
      scale.value = withTiming(0.985, { duration: motion.fast });
      pressed.value = withTiming(1, { duration: motion.fast });
    }, [pressed, scale]);

    const onPressOut = useCallback(() => {
      scale.value = withTiming(1, { duration: motion.fast });
      pressed.value = withTiming(0, { duration: motion.fast });
    }, [pressed, scale]);

    const gradient = variant === 'primary' && !inactive;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: inactive, busy: loading }}
        disabled={inactive}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={grow ? styles.grow : undefined}
      >
        <Animated.View
          style={[
            { height: m.height, borderRadius: m.radius },
            iconOnly && { width: m.height },
            styles.shell,
            gradient && (sizeKey === 'L' ? elevation.action : elevation.actionSm),
            animatedStyle,
            style,
          ]}
        >
          {gradient ? (
            <>
              <ActionSurface style={[StyleSheet.absoluteFill, { borderRadius: m.radius }]} />
              <Animated.View
                style={[StyleSheet.absoluteFill, styles.pressed, { borderRadius: m.radius }, pressedStyle]}
              />
              <View style={[StyleSheet.absoluteFill, styles.highlight, { borderRadius: m.radius }]} />
            </>
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { borderRadius: m.radius },
                inactive ? styles.disabled : styles[variant],
              ]}
            />
          )}

          <View
            style={[
              styles.content,
              { paddingHorizontal: iconOnly ? 0 : m.padding },
              (align === 'center' || iconOnly) && styles.center,
              align === 'start' && styles.start,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={color} size="small" />
            ) : (
              <>
                {icon}
                {label ? (
                  <Text variant={m.text} color={color}>
                    {label}
                  </Text>
                ) : null}
                {trailingText ? (
                  <Text variant="monoSm" color={color} style={styles.trailingText}>
                    {trailingText}
                  </Text>
                ) : null}
                {trailingIcon}
              </>
            )}
          </View>
        </Animated.View>
      </Pressable>
    );
  },
);

Button.displayName = 'Button';

const useStyles = makeStyles(({ colors }) => ({
  grow: {
    flexGrow: 1,
    flexBasis: 0,
  },
  shell: {
    overflow: 'visible',
  },
  primary: {
    backgroundColor: colors.action,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  soft: {
    backgroundColor: colors.chipActiveBg,
  },
  muted: {
    backgroundColor: colors.bg,
  },
  tertiary: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: colors.error.bg,
  },
  disabled: {
    backgroundColor: colors.disabledBg,
  },
  pressed: {
    backgroundColor: colors.actionPressed,
  },
  highlight: {
    borderTopWidth: 1,
    borderTopColor: colors.actionHighlight,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[2.5],
  },
  center: {
    justifyContent: 'center',
  },
  start: {
    justifyContent: 'flex-start',
  },
  trailingText: {
    opacity: 0.75,
  },
}));
