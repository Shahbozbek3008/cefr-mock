import { ReactNode, memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { Extrapolation, SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, size, space } from '../theme';
import { Text } from './Text';

const DIVIDER_RANGE = 12;

export type HeaderSurfaceProps = {
  children: ReactNode;
  scrollY?: SharedValue<number>;
  dividerFrom?: number;
  style?: StyleProp<ViewStyle>;
};

export const HeaderSurface = memo<HeaderSurfaceProps>(({ children, scrollY, dividerFrom = 0, style }) => {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  const divider = useAnimatedStyle(() => ({
    opacity: scrollY
      ? interpolate(scrollY.value, [dividerFrom, dividerFrom + DIVIDER_RANGE], [0, 1], Extrapolation.CLAMP)
      : 0,
  }));

  return (
    <View style={[styles.surface, { paddingTop: insets.top + size.topGap }, style]}>
      {children}
      <Animated.View pointerEvents="none" style={[styles.divider, divider]} />
    </View>
  );
});

HeaderSurface.displayName = 'HeaderSurface';

export type ScreenHeaderProps = {
  title: string;
  right?: ReactNode;
  scrollY?: SharedValue<number>;
};

export const ScreenHeader = memo<ScreenHeaderProps>(({ title, right, scrollY }) => {
  const styles = useStyles();

  return (
    <HeaderSurface scrollY={scrollY}>
      <View style={styles.bar}>
        <Text variant="titleLg" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </HeaderSurface>
  );
});

ScreenHeader.displayName = 'ScreenHeader';

const useStyles = makeStyles(({ colors }) => ({
  surface: {
    zIndex: 1,
    paddingHorizontal: size.screenPadding,
    paddingBottom: space[2],
    backgroundColor: colors.bg,
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: size.hairline,
    backgroundColor: colors.divider,
  },
  bar: {
    height: size.headerBar,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingHorizontal: space[1],
  },
  title: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
}));
