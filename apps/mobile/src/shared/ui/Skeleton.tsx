import { ReactNode, createContext, memo, useContext, useEffect } from 'react';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { makeStyles, radius as radii, type } from '../theme';
import type { TypeToken } from '../theme';
import { useI18n } from '../i18n';

const PULSE_MS = 900;
const PULSE_MIN = 0.5;
const APPEAR_DELAY_MS = 120;
const TEXT_FILL = 0.62;

const PulseContext = createContext<SharedValue<number> | null>(null);

export type SkeletonProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const Skeleton = ({ children, style }: SkeletonProps) => {
  const { t } = useI18n();
  const pulse = useSharedValue(1);

  useEffect(() => {
    const easing = Easing.inOut(Easing.quad);
    pulse.value = withRepeat(
      withSequence(
        withTiming(PULSE_MIN, { duration: PULSE_MS, easing }),
        withTiming(1, { duration: PULSE_MS, easing }),
      ),
      -1,
    );
  }, [pulse]);

  return (
    <PulseContext.Provider value={pulse}>
      <Animated.View
        entering={FadeIn.delay(APPEAR_DELAY_MS).duration(240)}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={t('common.loading')}
        accessibilityState={{ busy: true }}
        style={style}
      >
        {children}
      </Animated.View>
    </PulseContext.Provider>
  );
};

export type BoneProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  circle?: number;
  style?: StyleProp<ViewStyle>;
};

export const Bone = memo<BoneProps>(({ width = '100%', height = 12, radius, circle, style }) => {
  const styles = useStyles();
  const pulse = useContext(PulseContext);
  const animated = useAnimatedStyle(() => ({ opacity: pulse ? pulse.value : 1 }));
  const box = circle
    ? { width: circle, height: circle, borderRadius: circle / 2 }
    : { width, height, borderRadius: radius ?? Math.min(height / 2, radii.xs) };

  return <Animated.View style={[styles.bone, box, animated, style]} />;
});

Bone.displayName = 'Bone';

export type TextBoneProps = {
  variant: TypeToken;
  width?: DimensionValue;
  lines?: number;
  style?: StyleProp<ViewStyle>;
};

export const TextBone = memo<TextBoneProps>(({ variant, width = '100%', lines = 1, style }) => {
  const styles = useStyles();
  const { fontSize = 14, lineHeight = fontSize * 1.3 } = type[variant];
  const height = Math.round(fontSize * TEXT_FILL);

  return (
    <View style={style}>
      {Array.from({ length: lines }, (_, index) => (
        <View key={index} style={[styles.line, { height: lineHeight }]}>
          <Bone width={lines > 1 && index === lines - 1 ? '64%' : width} height={height} />
        </View>
      ))}
    </View>
  );
});

TextBone.displayName = 'TextBone';

const useStyles = makeStyles(({ colors }) => ({
  bone: {
    backgroundColor: colors.skeleton,
  },
  line: {
    justifyContent: 'center',
  },
}));
