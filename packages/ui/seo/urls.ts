import { routing, type Locale } from "../i18n/routing";

export const resolveSiteUrl = (
  explicit: string | undefined,
  devFallback: string,
) => {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return (
    explicit ?? (vercelHost ? `https://${vercelHost}` : devFallback)
  ).replace(/\/+$/, "");
};

export function createSeoUrls(siteUrl: string) {
  const localePath = (locale: Locale, path = "") =>
    `${locale === routing.defaultLocale ? "" : `/${locale}`}${path}` || "/";

  const absoluteUrl = (path: string) =>
    path === "/" ? siteUrl : new URL(path, `${siteUrl}/`).toString();

  const languageAlternates = (path = "") => ({
    ...Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        absoluteUrl(localePath(locale, path)),
      ]),
    ),
    "x-default": absoluteUrl(localePath(routing.defaultLocale, path)),
  });

  return { siteUrl, localePath, absoluteUrl, languageAlternates };
}

export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
