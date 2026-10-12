import { SITE_URL } from "@/constants/seo";
import { routing, type Locale } from "@cefr/ui/i18n/routing";

export const localePath = (locale: Locale, path = "") =>
  `${locale === routing.defaultLocale ? "" : `/${locale}`}${path}` || "/";

// Root is emitted without a trailing slash so it matches how Next renders canonical/hreflang links.
export const absoluteUrl = (path: string) =>
  path === "/" ? SITE_URL : new URL(path, `${SITE_URL}/`).toString();

export const languageAlternates = (path = "") => ({
  ...Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      absoluteUrl(localePath(locale, path)),
    ]),
  ),
  "x-default": absoluteUrl(localePath(routing.defaultLocale, path)),
});

export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
