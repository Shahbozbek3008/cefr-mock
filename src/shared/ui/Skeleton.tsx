import { memo, useEffect } from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { light, radius, space } from '../theme';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  style?: ViewStyle;
};

export const Skeleton = memo<SkeletonProps>(({ width = '100%', height = 8, style }) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.45, { duration: 800 }), -1, true);
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[styles.bar, { width, height, borderRadius: height / 2 }, animated, style]}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export const SkeletonCard = memo<{ lines?: number }>(({ lines = 3 }) => (
  <View style={styles.card}>
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton key={index} width={index === 0 ? '70%' : index === lines - 1 ? '50%' : '100%'} />
    ))}
  </View>
));

SkeletonCard.displayName = 'SkeletonCard';

const styles = StyleSheet.create({
  bar: {
    backgroundColor: light.skeleton,
  },
  card: {
    borderRadius: radius.card,
    backgroundColor: light.surface,
    padding: space[4],
    gap: space[2],
  },
});
