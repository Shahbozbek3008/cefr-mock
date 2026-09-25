import { ReactNode, memo, useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { elevation, light, motion, radius, size, space, TypeToken } from '../theme';
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

const surfaces: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: light.action },
  secondary: { backgroundColor: light.surface, borderWidth: 1, borderColor: light.border },
  soft: { backgroundColor: light.chipActiveBg },
  muted: { backgroundColor: light.bg },
  tertiary: { backgroundColor: 'transparent' },
  destructive: { backgroundColor: light.error.bg },
};

const textColors: Record<Variant, string> = {
  primary: light.onAction,
  secondary: light.text,
  soft: light.selectedText,
  muted: light.textStrong,
  tertiary: light.link,
  destructive: light.error.text,
};

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
    const scale = useSharedValue(1);
    const pressed = useSharedValue(0);
    const inactive = disabled || loading;
    const m = metrics[sizeKey];
    const color = inactive ? light.disabledText : textColors[variant];
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
              <Animated.View style={[StyleSheet.absoluteFill, styles.pressed, { borderRadius: m.radius }, pressedStyle]} />
              <View style={[StyleSheet.absoluteFill, styles.highlight, { borderRadius: m.radius }]} />
            </>
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { borderRadius: m.radius },
                inactive ? styles.disabled : surfaces[variant],
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

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1,
    flexBasis: 0,
  },
  shell: {
    overflow: 'visible',
  },
  disabled: {
    backgroundColor: light.disabledBg,
  },
  pressed: {
    backgroundColor: light.actionPressed,
  },
  highlight: {
    borderTopWidth: 1,
    borderTopColor: light.actionHighlight,
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
});
