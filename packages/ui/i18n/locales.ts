export const locales = ['uz', 'ru', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'uz';

export const isLocale = (value: string | undefined): value is Locale => (locales as readonly string[]).includes(value ?? '');

export const localizePath = (path: string, locale: Locale) => {
  if (locale === defaultLocale) return path;
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
};

export const delocalizePath = (pathname: string) => {
  const [, first, ...rest] = pathname.split('/');
  return isLocale(first) ? `/${rest.join('/')}` : pathname;
};
