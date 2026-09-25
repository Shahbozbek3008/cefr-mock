import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { captureRef } from 'react-native-view-shot';
import { resolveScheme, useTheme, useThemePreference } from '@/shared/theme';
import type { ThemePreference } from '@/shared/theme';

export type Origin = { x: number; y: number };

type Snapshot = { uri: string; origin: Origin | null };

type ThemeSwitch = {
  capture: () => void;
  apply: (preference: ThemePreference, origin: Origin) => void;
  release: () => void;
};

const COLLAPSE_MS = 480;

const ThemeSwitchContext = createContext<ThemeSwitch | null>(null);

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
  const pendingRef = useRef<Promise<string | null> | null>(null);
  const runningRef = useRef(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const radius = useSharedValue(0);

  const finish = useCallback(() => {
    pendingRef.current = null;
    runningRef.current = false;
    setSnapshot(null);
  }, []);

  const onLoaded = useCallback(() => {
    loadedRef.current?.();
    loadedRef.current = null;
  }, []);

  const capture = useCallback(() => {
    if (pendingRef.current || runningRef.current || !rootRef.current) return;
    radius.value = Math.hypot(width, height);
    const pending = captureRef(rootRef, { format: 'jpg', quality: 0.9, result: 'tmpfile' })
      .then((uri) => {
        if (pendingRef.current !== pending) return null;
        return new Promise<string>((resolve) => {
          loadedRef.current = () => resolve(uri);
          setSnapshot({ uri, origin: null });
        });
      })
      .catch(() => null);
    pendingRef.current = pending;
  }, [height, radius, width]);

  const release = useCallback(() => {
    if (!runningRef.current) finish();
  }, [finish]);

  const apply = useCallback(
    async (preference: ThemePreference, origin: Origin) => {
      const current = resolveScheme(useThemePreference.getState().preference, system);
      if (resolveScheme(preference, system) === current) {
        setPreference(preference);
        return;
      }

      capture();
      runningRef.current = true;
      const uri = await pendingRef.current;
      if (!uri) {
        finish();
        setPreference(preference);
        return;
      }

      radius.value = Math.hypot(Math.max(origin.x, width - origin.x), Math.max(origin.y, height - origin.y));
      setSnapshot({ uri, origin });
      setPreference(preference);

      requestAnimationFrame(() => {
        radius.value = withTiming(0, { duration: COLLAPSE_MS, easing: Easing.bezier(0.4, 0, 0.2, 1) }, (done) => {
          if (done) scheduleOnRN(finish);
        });
      });
    },
    [capture, finish, height, radius, setPreference, system, width],
  );

  const value = useMemo(() => ({ capture, apply, release }), [capture, apply, release]);
  const origin = snapshot?.origin;
  const ox = origin?.x ?? 0;
  const oy = origin?.y ?? 0;

  const circleStyle = useAnimatedStyle(() => ({
    left: ox - radius.value,
    top: oy - radius.value,
    width: radius.value * 2,
    height: radius.value * 2,
    borderRadius: radius.value,
  }));

  const frameStyle = useAnimatedStyle(() => ({
    left: radius.value - ox,
    top: radius.value - oy,
  }));

  return (
    <ThemeSwitchContext.Provider value={value}>
      <View ref={rootRef} collapsable={false} style={[styles.root, { backgroundColor: colors.bg }]}>
        {children}
      </View>

      {snapshot ? (
        <View pointerEvents={origin ? 'auto' : 'none'} style={[StyleSheet.absoluteFill, !origin && styles.hidden]}>
          <Animated.View style={[styles.circle, circleStyle]}>
            <Animated.Image
              source={{ uri: snapshot.uri }}
              fadeDuration={0}
              onLoad={onLoaded}
              onError={onLoaded}
              style={[styles.frame, { width, height }, frameStyle]}
            />
          </Animated.View>
        </View>
      ) : null}
    </ThemeSwitchContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
  frame: {
    position: 'absolute',
  },
  circle: {
    position: 'absolute',
    overflow: 'hidden',
  },
});
