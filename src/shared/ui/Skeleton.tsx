import { memo, useEffect } from 'react';
import { DimensionValue, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { makeStyles, radius, space } from '../theme';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  style?: ViewStyle;
};

export const Skeleton = memo<SkeletonProps>(({ width = '100%', height = 8, style }) => {
  const styles = useStyles();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.45, { duration: 800 }), -1, true);
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.bar, { width, height, borderRadius: height / 2 }, animated, style]} />;
});

Skeleton.displayName = 'Skeleton';

export const SkeletonCard = memo<{ lines?: number }>(({ lines = 3 }) => {
  const styles = useStyles();

  return (
    <View style={styles.card}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} width={index === 0 ? '70%' : index === lines - 1 ? '50%' : '100%'} />
      ))}
    </View>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

const useStyles = makeStyles(({ colors }) => ({
  bar: {
    backgroundColor: colors.skeleton,
  },
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    padding: space[4],
    gap: space[2],
  },
}));
