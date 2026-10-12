import { routing } from '@cefr/ui/i18n/routing';
import { OG_IMAGE_ALT, OG_IMAGE_SIZE } from '@cefr/ui/seo/constants';
import { renderAppOgImage } from '@/lib/og-image';

export const alt = OG_IMAGE_ALT;
export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function TwitterImage({ params }: { params: Promise<{ locale: string }> }) {
  return renderAppOgImage((await params).locale);
}
