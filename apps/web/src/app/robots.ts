import { CRAWL_DISALLOWED_PATHS, SITE_URL } from "@/constants/seo";
import { localePath } from "@/lib/seo";
import { routing } from "@cefr/ui/i18n/routing";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const roots = routing.locales.map((locale) => `${localePath(locale)}$`);
  const privatePaths = routing.locales.flatMap((locale) =>
    CRAWL_DISALLOWED_PATHS.map((path) => localePath(locale, path)),
  );

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...roots, ...privatePaths],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
