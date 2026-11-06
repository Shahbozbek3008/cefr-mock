import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { IntlProvider } from 'use-intl';
import { defaultLocale, isLocale, type Locale } from '@cefr/ui/i18n/locales';
import { LOCALE_STORAGE_KEY } from '@/shared/config/storage';
import en from './messages/en.json';
import ru from './messages/ru.json';
import uz from './messages/uz.json';

const MESSAGES = { uz, ru, en } satisfies Record<Locale, typeof uz>;

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

type LocaleControl = { locale: Locale; setLocale: (locale: Locale) => void };

const LocaleContext = createContext<LocaleControl | null>(null);

const readStoredLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) ?? undefined;
    return isLocale(stored) ? stored : defaultLocale;
  } catch {
    return defaultLocale;
  }
};

const storeLocale = (locale: Locale) => {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    return;
  }
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const control = useMemo<LocaleControl>(
    () => ({
      locale,
      setLocale: (next) => {
        storeLocale(next);
        setLocaleState(next);
      },
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={control}>
      <IntlProvider locale={locale} messages={MESSAGES[locale]} timeZone={TIME_ZONE}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export const useLocaleControl = () => {
  const control = useContext(LocaleContext);
  if (!control) throw new Error('LocaleProvider is missing');
  return control;
};
