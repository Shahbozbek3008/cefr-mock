import { createSeoUrls } from '@cefr/ui/seo/urls';
import { SITE_URL } from '@/constants/seo';

export const { localePath, absoluteUrl, languageAlternates } = createSeoUrls(SITE_URL);

export { serializeJsonLd } from '@cefr/ui/seo/urls';
