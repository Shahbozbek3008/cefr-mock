import { routing, type Locale } from '../i18n/routing';

// Canonical origin: explicit env first, then Vercel's production domain, then the local dev server.
export const resolveSiteUrl = (explicit: string | undefined, devFallback: string) => {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return (explicit ?? (vercelHost ? `https://${vercelHost}` : devFallback)).replace(/\/+$/, '');
};

export function createSeoUrls(siteUrl: string) {
  const localePath = (locale: Locale, path = '') => `${locale === routing.defaultLocale ? '' : `/${locale}`}${path}` || '/';

  // Root is emitted without a trailing slash so it matches how Next renders canonical/hreflang links.
  const absoluteUrl = (path: string) => (path === '/' ? siteUrl : new URL(path, `${siteUrl}/`).toString());

  const languageAlternates = (path = '') => ({
    ...Object.fromEntries(routing.locales.map((locale) => [locale, absoluteUrl(localePath(locale, path))])),
    'x-default': absoluteUrl(localePath(routing.defaultLocale, path)),
  });

  return { siteUrl, localePath, absoluteUrl, languageAlternates };
}

// JSON-LD is embedded inside a <script>; escape "<" so content can never close the tag early.
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
