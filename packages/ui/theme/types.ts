import type { THEME_PREFERENCES } from './constants';

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type ResolvedTheme = Exclude<ThemePreference, 'system'>;
