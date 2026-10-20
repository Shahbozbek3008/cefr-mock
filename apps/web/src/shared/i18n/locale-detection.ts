import { defaultLocale, isLocale, localizePath, type Locale } from '@cefr/ui/i18n/locales';
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from './constants';
import { readCookie } from '@/shared/lib/cookies';

const browserLocale = () => navigator.languages.map((language) => language.slice(0, 2).toLowerCase()).find(isLocale);

const preferredLocale = (): Locale => {
  const saved = readCookie(LOCALE_COOKIE);
  return isLocale(saved) ? saved : (browserLocale() ?? defaultLocale);
};

export function redirectToPreferredLocale() {
  const { pathname, search, hash } = window.location;
  const [, firstSegment] = pathname.split('/');
  if (isLocale(firstSegment)) return;

  const locale = preferredLocale();
  if (locale === defaultLocale) return;

  window.history.replaceState(null, '', `${localizePath(pathname, locale)}${search}${hash}`);
}

export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}
