import { resolveSiteUrl } from '@cefr/ui/seo/urls';

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3001');

export const SEARCH_VERIFICATION = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
} as const;
