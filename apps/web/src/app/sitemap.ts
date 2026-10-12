import type { MetadataRoute } from 'next';
import { routing } from '@cefr/ui/i18n/routing';
import { PUBLIC_PAGES } from '@/constants/seo';
import { absoluteUrl, languageAlternates, localePath } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PUBLIC_PAGES.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, page.path)),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: locale === routing.defaultLocale ? 0.8 : 0.7,
      alternates: { languages: languageAlternates(page.path) },
    })),
  );
}
