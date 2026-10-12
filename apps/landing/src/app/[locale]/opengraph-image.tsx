import { BRAND_NAME } from '@cefr/ui/components/logo';
import { routing } from '@cefr/ui/i18n/routing';
import { OG_IMAGE_SIZE } from '@/constants/seo';
import { renderOgImage } from '@/lib/og-image';

export const alt = `${BRAND_NAME} — CEFR mock tests with AI scoring`;
export const size = OG_IMAGE_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  return renderOgImage((await params).locale);
}
