import { StyleSheet, useColorScheme } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../lib/storage';
import { dark, light } from './colors';
import type { Colors } from './colors';
import { createElevation } from './elevation';
import type { Elevation } from './elevation';

export type Scheme = 'light' | 'dark';
export type ThemePreference = Scheme | 'system';

export type Theme = {
  scheme: Scheme;
  colors: Colors;
  elevation: Elevation;
};

export const themes: Record<Scheme, Theme> = {
  light: { scheme: 'light', colors: light, elevation: createElevation(light, 'light') },
  dark: { scheme: 'dark', colors: dark, elevation: createElevation(dark, 'dark') },
};

type PreferenceStore = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemePreference = create<PreferenceStore>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    { name: 'theme-preference', storage: createJSONStorage(() => mmkvStorage) },
  ),
);

export const resolveScheme = (preference: ThemePreference, system: string | null | undefined): Scheme =>
  preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

export const useScheme = (): Scheme => {
  const preference = useThemePreference((s) => s.preference);
  const system = useColorScheme();
  return resolveScheme(preference, system);
};

export const useTheme = () => themes[useScheme()];

export const makeStyles = <T extends StyleSheet.NamedStyles<T>>(factory: (theme: Theme) => T) => {
  const cache: Partial<Record<Scheme, T>> = {};

  return () => {
    const theme = useTheme();
    cache[theme.scheme] ??= StyleSheet.create(factory(theme));
    return cache[theme.scheme] as T;
  };
};
