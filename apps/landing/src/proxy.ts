import createMiddleware from 'next-intl/middleware';
import { routing } from '@cefr/ui/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Metadata image routes live under each locale segment and must be served as-is (no i18n redirect for crawlers).
  matcher:
    '/((?!api|_next|_vercel|apple-icon|uz/opengraph-image|ru/opengraph-image|en/opengraph-image|uz/twitter-image|ru/twitter-image|en/twitter-image|.*\\..*).*)',
};
