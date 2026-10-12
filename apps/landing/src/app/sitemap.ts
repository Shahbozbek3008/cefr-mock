import type { MetadataRoute } from 'next';
import { routing } from '@cefr/ui/i18n/routing';
import { absoluteUrl, languageAlternates, localePath } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routing.locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified,
    changeFrequency: 'weekly',
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: { languages: languageAlternates() },
  }));
}
