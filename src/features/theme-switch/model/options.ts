import type { ThemePreference } from '@/shared/theme';

export const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Tizim' },
  { value: 'light', label: "Yorug'" },
  { value: 'dark', label: 'Tungi' },
];

export const themeLabel = (preference: ThemePreference) =>
  themeOptions.find((option) => option.value === preference)?.label ?? '';
