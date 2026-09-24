import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { elevation, light, motion } from '../theme';

export type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
};

const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const THUMB = 24;
const PADDING = 3;

export const Switch = memo<SwitchProps>(({ value, onValueChange, accessibilityLabel }) => {
  const progress = useDerivedValue(() =>
    withTiming(value ? 1 : 0, { duration: motion.base }),
  );

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [light.borderStrong, light.action],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * (TRACK_WIDTH - THUMB - PADDING * 2) },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, elevation.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
});

Switch.displayName = 'Switch';

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: PADDING,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: light.surface,
  },
});
