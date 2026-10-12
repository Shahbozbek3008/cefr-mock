import { resolveSiteUrl } from '@cefr/ui/seo/urls';
import { ROUTES } from '@/constants/routes';

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000');

export const SEARCH_VERIFICATION = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
} as const;

// The only pages a signed-out visitor (and a crawler) can see; everything else redirects to /login.
export const PUBLIC_PAGES = [
  { path: ROUTES.login, titleKey: 'loginTitle', descriptionKey: 'loginDescription' },
  { path: ROUTES.start, titleKey: 'startTitle', descriptionKey: 'startDescription' },
] as const;

export const CRAWL_DISALLOWED_PATHS = [
  ROUTES.catalog,
  '/results',
  ROUTES.progress,
  ROUTES.settings,
  ROUTES.billing,
  ROUTES.loginVerify,
  ROUTES.startDate,
  ROUTES.startAccount,
  ROUTES.startVerify,
] as const;
