import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CircleCheck, TriangleAlert, WifiOff } from 'lucide-react-native';
import { create } from 'zustand';
import { elevation, hitSlop, light, radius, space } from '../theme';
import { Text } from './Text';

type ToastTone = 'info' | 'success' | 'offline' | 'error';

type ToastState = {
  message: string | null;
  tone: ToastTone;
  actionLabel?: string;
  onAction?: () => void;
  show: (toast: { message: string; tone?: ToastTone; actionLabel?: string; onAction?: () => void }) => void;
  hide: () => void;
};

export const useToast = create<ToastState>((set) => ({
  message: null,
  tone: 'info',
  show: ({ message, tone = 'info', actionLabel, onAction }) => set({ message, tone, actionLabel, onAction }),
  hide: () => set({ message: null, actionLabel: undefined, onAction: undefined }),
}));

const icons = {
  info: { Icon: CircleCheck, color: light.data },
  success: { Icon: CircleCheck, color: light.success[500] },
  offline: { Icon: WifiOff, color: light.warning[500] },
  error: { Icon: TriangleAlert, color: light.error[500] },
} as const;

export const ToastHost = memo(() => {
  const insets = useSafeAreaInsets();
  const message = useToast((s) => s.message);
  const tone = useToast((s) => s.tone);
  const actionLabel = useToast((s) => s.actionLabel);
  const onAction = useToast((s) => s.onAction);
  const hide = useToast((s) => s.hide);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hide, 3500);
    return () => clearTimeout(timer);
  }, [message, hide]);

  if (!message) return null;

  const { Icon, color } = icons[tone];

  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      style={[styles.toast, elevation.sheet, { bottom: insets.bottom + 96 }]}
    >
      <Icon size={18} color={color} strokeWidth={1.75} />
      <View style={styles.body}>
        <Text variant="callout">{message}</Text>
      </View>
      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={hitSlop}
          onPress={() => {
            onAction?.();
            hide();
          }}
        >
          <Text variant="calloutMedium" color={light.link}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
});

ToastHost.displayName = 'ToastHost';

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: space[4],
    right: space[4],
    minHeight: 52,
    borderRadius: radius.button,
    backgroundColor: light.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[4],
    paddingVertical: space[3],
  },
  body: {
    flex: 1,
  },
});
