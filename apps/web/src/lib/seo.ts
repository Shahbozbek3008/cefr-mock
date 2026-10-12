import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { resolveLocale, type LocaleParams } from '@cefr/ui/i18n/locale';
import { routing } from '@cefr/ui/i18n/routing';
import { BRAND_NAME } from '@cefr/ui/components/logo';
import { INDEXABLE_ROBOTS, OG_IMAGE_ALT, OG_IMAGE_SIZE, OG_LOCALES } from '@cefr/ui/seo/constants';
import { createSeoUrls } from '@cefr/ui/seo/urls';
import { PUBLIC_PAGES, SITE_URL } from '@/constants/seo';

export const { localePath, absoluteUrl, languageAlternates } = createSeoUrls(SITE_URL);

export { serializeJsonLd } from '@cefr/ui/seo/urls';

type PublicPage = (typeof PUBLIC_PAGES)[number];

// Opts a signed-out page into indexing with its own canonical, hreflang and social preview.
export function publicPageMetadata(page: PublicPage) {
  return async ({ params }: { params: LocaleParams }): Promise<Metadata> => {
    const locale = await resolveLocale(params);
    const t = await getTranslations({ locale, namespace: 'metadata' });
    const title = t(page.titleKey);
    const description = t(page.descriptionKey);
    const url = localePath(locale, page.path);
    // A page-level openGraph replaces the layout's, and the [locale] image files don't reach nested pages — so set them here.
    const image = { url: `/${locale}/opengraph-image`, ...OG_IMAGE_SIZE, alt: OG_IMAGE_ALT, type: 'image/png' };
    return {
      title,
      description,
      alternates: { canonical: url, languages: languageAlternates(page.path) },
      robots: INDEXABLE_ROBOTS,
      openGraph: {
        type: 'website',
        siteName: BRAND_NAME,
        title,
        description,
        url,
        locale: OG_LOCALES[locale],
        alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
        images: [image],
      },
      twitter: { card: 'summary_large_image', title, description, images: [{ ...image, url: `/${locale}/twitter-image` }] },
    };
  };
}
