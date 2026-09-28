import type { Component } from 'react';
import { scrollTo, useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import type Animated from 'react-native-reanimated';

const SETTLE_VELOCITY = 0.3;

export const useScrollHeader = <T extends Component = Animated.ScrollView>(snapDistance = 0) => {
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<T>();

  const settle = (y: number) => {
    'worklet';
    if (snapDistance <= 0 || y <= 0 || y >= snapDistance) return;
    scrollTo(scrollRef, 0, y < snapDistance / 2 ? 0 : snapDistance, true);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onEndDrag: (event) => {
      if (Math.abs(event.velocity?.y ?? 0) < SETTLE_VELOCITY) settle(event.contentOffset.y);
    },
    onMomentumEnd: (event) => {
      settle(event.contentOffset.y);
    },
  });

  return { scrollY, scrollRef, onScroll };
};
