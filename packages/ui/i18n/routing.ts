import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './locales';

export { locales, type Locale } from './locales';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});
