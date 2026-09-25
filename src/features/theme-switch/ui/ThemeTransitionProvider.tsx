import { ReactNode, createContext, useCallback, useContext, useRef, useState } from 'react';
import { Image, StyleSheet, View, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { captureRef } from 'react-native-view-shot';
import { resolveScheme, useTheme, useThemePreference } from '@/shared/theme';
import type { ThemePreference } from '@/shared/theme';

export type Origin = { x: number; y: number };

type Snapshot = { before: string; after?: string; origin: Origin };

type ThemeSwitch = (preference: ThemePreference, origin: Origin) => Promise<void>;

const REVEAL_MS = 520;
const SETTLE_MS = 60;

const ThemeSwitchContext = createContext<ThemeSwitch | null>(null);

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const useThemeSwitch = () => {
  const context = useContext(ThemeSwitchContext);
  if (!context) throw new Error('useThemeSwitch must be used inside ThemeTransitionProvider');
  return context;
};

export const ThemeTransitionProvider = ({ children }: { children: ReactNode }) => {
  const { colors } = useTheme();
  const system = useColorScheme();
  const setPreference = useThemePreference((s) => s.setPreference);
  const { width, height } = useWindowDimensions();
  const rootRef = useRef<View>(null);
  const loadedRef = useRef<(() => void) | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const radius = useSharedValue(0);

  const show = useCallback(
    (next: Snapshot) =>
      new Promise<void>((resolve) => {
        loadedRef.current = resolve;
        setSnapshot(next);
      }),
    [],
  );

  const onLoaded = useCallback(() => {
    loadedRef.current?.();
    loadedRef.current = null;
  }, []);

  const finish = useCallback(() => setSnapshot(null), []);

  const switchTheme = useCallback<ThemeSwitch>(
    async (preference, origin) => {
      const current = resolveScheme(useThemePreference.getState().preference, system);
      if (resolveScheme(preference, system) === current || !rootRef.current) {
        setPreference(preference);
        return;
      }

      try {
        const before = await captureRef(rootRef, { format: 'png', result: 'tmpfile' });
        await show({ before, origin });
        setPreference(preference);
        await nextFrame();
        await nextFrame();
        await wait(SETTLE_MS);
        const after = await captureRef(rootRef, { format: 'png', result: 'tmpfile' });
        radius.value = 0;
        await show({ before, after, origin });

        const target = Math.hypot(Math.max(origin.x, width - origin.x), Math.max(origin.y, height - origin.y));
        radius.value = withTiming(target, { duration: REVEAL_MS, easing: Easing.bezier(0.4, 0, 0.2, 1) }, (done) => {
          if (done) scheduleOnRN(finish);
        });
      } catch {
        setPreference(preference);
        finish();
      }
    },
    [finish, height, radius, setPreference, show, system, width],
  );

  const origin = snapshot?.origin ?? { x: 0, y: 0 };

  const circleStyle = useAnimatedStyle(() => ({
    left: origin.x - radius.value,
    top: origin.y - radius.value,
    width: radius.value * 2,
    height: radius.value * 2,
    borderRadius: radius.value,
  }));

  const revealStyle = useAnimatedStyle(() => ({
    left: radius.value - origin.x,
    top: radius.value - origin.y,
  }));

  return (
    <ThemeSwitchContext.Provider value={switchTheme}>
      <View ref={rootRef} collapsable={false} style={[styles.root, { backgroundColor: colors.bg }]}>
        {children}
      </View>

      {snapshot ? (
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={{ uri: snapshot.before }}
            fadeDuration={0}
            onLoad={snapshot.after ? undefined : onLoaded}
            onError={snapshot.after ? undefined : onLoaded}
            style={[styles.frame, { width, height }]}
          />
          {snapshot.after ? (
            <Animated.View style={[styles.circle, circleStyle]}>
              <Animated.Image
                source={{ uri: snapshot.after }}
                fadeDuration={0}
                onLoad={onLoaded}
                onError={onLoaded}
                style={[styles.frame, { width, height }, revealStyle]}
              />
            </Animated.View>
          ) : null}
        </View>
      ) : null}
    </ThemeSwitchContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  frame: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  circle: {
    position: 'absolute',
    overflow: 'hidden',
  },
});
