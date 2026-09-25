import { ReactNode, memo, useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Modal, Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SchemeLock, makeStyles, motion, radius, space, useLiveScheme, useTheme } from '../theme';
import { useI18n } from '../i18n';

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  onHidden?: () => void;
  children: ReactNode;
};

const decelerate = Easing.bezier(...motion.curve.decelerate);
const accelerate = Easing.bezier(...motion.curve.accelerate);

const SheetBody = ({ visible, onClose, onHidden, children }: SheetProps) => {
  const styles = useStyles();
  const { elevation } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const translate = useSharedValue(screenHeight);
  const backdrop = useSharedValue(0);
  const distance = useRef(screenHeight);
  const opened = useRef(false);
  const hiddenRef = useRef(onHidden);
  hiddenRef.current = onHidden;
  const bottom = Math.max(insets.bottom, space[2]);

  const hide = useCallback(() => {
    opened.current = false;
    setMounted(false);
    hiddenRef.current?.();
  }, []);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      distance.current = event.nativeEvent.layout.height + bottom;
      if (!visible || opened.current) return;
      opened.current = true;
      translate.value = distance.current;
      translate.value = withTiming(0, { duration: motion.sheetIn, easing: decelerate });
      backdrop.value = withTiming(1, { duration: motion.sheetIn, easing: decelerate });
    },
    [backdrop, bottom, translate, visible],
  );

  useEffect(() => {
    if (visible) {
      if (opened.current) {
        translate.value = withTiming(0, { duration: motion.sheetIn, easing: decelerate });
        backdrop.value = withTiming(1, { duration: motion.sheetIn, easing: decelerate });
      }
      setMounted(true);
      return;
    }
    if (!mounted) return;
    backdrop.value = withTiming(0, { duration: motion.sheetOut, easing: accelerate });
    translate.value = withTiming(distance.current, { duration: motion.sheetOut, easing: accelerate }, (finished) => {
      if (finished) scheduleOnRN(hide);
    });
  }, [visible, mounted, backdrop, translate, hide]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translate.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  const close = useCallback(() => onClose(), [onClose]);

  return (
    <Modal
      visible={mounted}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="none"
      onRequestClose={close}
    >
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
        {Platform.OS === 'ios' ? <BlurView intensity={8} tint="dark" style={StyleSheet.absoluteFill} /> : null}
        <Pressable
          accessibilityLabel={t('common.close')}
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={close}
        />
      </Animated.View>

      <Animated.View onLayout={onLayout} style={[styles.sheet, elevation.sheet, { bottom }, sheetStyle]}>
        <View style={styles.grabber} />
        {children}
      </Animated.View>
    </Modal>
  );
};

export const Sheet = memo<SheetProps>((props) => {
  const live = useLiveScheme();
  const scheme = useRef(live);
  if (props.visible) scheme.current = live;

  return (
    <SchemeLock value={scheme.current}>
      <SheetBody {...props} />
    </SchemeLock>
  );
});

Sheet.displayName = 'Sheet';

const useStyles = makeStyles(({ colors }) => ({
  backdrop: {
    backgroundColor: colors.overlay,
  },
  sheet: {
    position: 'absolute',
    left: space[2],
    right: space[2],
    backgroundColor: colors.surface,
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
    backgroundColor: colors.border,
  },
}));
