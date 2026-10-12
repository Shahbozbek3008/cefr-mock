import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@cefr/ui/i18n/routing';
import { renderOgImage } from '@cefr/ui/seo/og-image';
import { SITE_URL } from '@/constants/seo';

export async function renderLandingOgImage(requestedLocale: string) {
  const locale = hasLocale(routing.locales, requestedLocale) ? requestedLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return renderOgImage({ headline: t('ogHeadline'), tagline: t('ogTagline'), siteUrl: SITE_URL });
}
