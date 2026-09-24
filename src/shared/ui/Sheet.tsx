import { ReactNode, memo, useCallback, useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { elevation, light, motion, radius, space } from '../theme';

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

const OFFSCREEN = 600;

export const Sheet = memo<SheetProps>(({ visible, onClose, children }) => {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const translate = useSharedValue(OFFSCREEN);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      backdrop.value = withTiming(1, { duration: motion.base });
      translate.value = withSpring(0, motion.spring);
      return;
    }
    backdrop.value = withTiming(0, { duration: motion.base });
    translate.value = withTiming(OFFSCREEN, { duration: motion.base }, (finished) => {
      if (finished) scheduleOnRN(setMounted, false);
    });
  }, [visible, backdrop, translate]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translate.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  const close = useCallback(() => onClose(), [onClose]);

  return (
    <Modal visible={mounted} transparent statusBarTranslucent navigationBarTranslucent animationType="none" onRequestClose={close}>
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={8} tint="dark" style={StyleSheet.absoluteFill} />
        ) : null}
        <Pressable accessibilityLabel="Yopish" style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={close} />
      </Animated.View>

      <Animated.View
        style={[styles.sheet, elevation.sheet, { bottom: Math.max(insets.bottom, space[2]) }, sheetStyle]}
      >
        <View style={styles.grabber} />
        {children}
      </Animated.View>
    </Modal>
  );
});

Sheet.displayName = 'Sheet';

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: light.overlay,
  },
  sheet: {
    position: 'absolute',
    left: space[2],
    right: space[2],
    backgroundColor: light.surface,
    borderRadius: radius.sheetLg,
    paddingTop: space[3],
    paddingHorizontal: space[5],
    paddingBottom: space[6],
    gap: space[5.5],
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: light.border,
  },
});
