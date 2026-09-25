import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../lib/storage';
import type { Locale } from './types';

export const locales: { value: Locale; label: string }[] = [
  { value: 'uz', label: "O'zbekcha" },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];

const deviceLocale = (): Locale => {
  const tag = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
  if (tag.startsWith('ru')) return 'ru';
  if (tag.startsWith('en')) return 'en';
  return 'uz';
};

type LocaleStore = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: deviceLocale(),
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'locale', storage: createJSONStorage(() => mmkvStorage) },
  ),
);
