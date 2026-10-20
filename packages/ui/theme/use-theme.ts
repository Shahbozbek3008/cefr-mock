'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { DARK_QUERY, THEME_PREFERENCES, THEME_STORAGE_KEY } from './constants';
import type { ResolvedTheme, ThemePreference } from './types';

const listeners = new Set<() => void>();

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (THEME_PREFERENCES as readonly string[]).includes(stored ?? '') ? (stored as ThemePreference) : 'system';
  } catch {
    return 'system';
  }
};

const resolve = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? (matchMedia(DARK_QUERY).matches ? 'dark' : 'light') : preference;

const apply = (preference: ThemePreference) => {
  document.documentElement.dataset.theme = resolve(preference);
};

export const applyStoredTheme = () => apply(readPreference());

const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  const media = matchMedia(DARK_QUERY);
  const onSystemChange = () => {
    if (readPreference() === 'system') apply('system');
    listener();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    apply(readPreference());
    listener();
  };
  media.addEventListener('change', onSystemChange);
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    media.removeEventListener('change', onSystemChange);
    window.removeEventListener('storage', onStorage);
  };
}

export function useTheme() {
  const preference = useSyncExternalStore(subscribe, readPreference, () => 'system' as const);
  const resolved = useSyncExternalStore(subscribe, () => resolve(readPreference()), () => 'light' as const);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    apply(next);
    notify();
  }, []);

  return { preference, resolved, setPreference };
}
