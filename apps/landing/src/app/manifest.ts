import type { MetadataRoute } from 'next';
import { getTranslations } from 'next-intl/server';
import { BRAND_NAME } from '@cefr/ui/components/logo';
import { routing } from '@cefr/ui/i18n/routing';
import { THEME_COLORS } from '@cefr/ui/theme/constants';
import { APPLE_ICON_SIZE } from '@cefr/ui/seo/constants';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: 'metadata' });
  return {
    name: BRAND_NAME,
    short_name: 'CEFR',
    description: t('description'),
    start_url: '/',
    display: 'standalone',
    lang: routing.defaultLocale,
    background_color: THEME_COLORS.light,
    theme_color: THEME_COLORS.light,
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: `${APPLE_ICON_SIZE.width}x${APPLE_ICON_SIZE.height}`, type: 'image/png' },
    ],
  };
}
