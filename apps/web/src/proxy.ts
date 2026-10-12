import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@cefr/ui/i18n/routing';
import { readSessionUser } from './lib/supabase/session';
import { GUEST_ONLY, LOCALE_PREFIX } from '@/constants/routes';

const intl = createMiddleware(routing);

const redirectTo = (request: NextRequest, response: NextResponse, path: string) => {
  const prefix = request.nextUrl.pathname.match(LOCALE_PREFIX)?.[0] ?? '';
  const redirect = NextResponse.redirect(new URL(`${prefix}${path}`, request.url));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
};

export default async function proxy(request: NextRequest) {
  const response = intl(request);
  if (response.headers.has('location')) return response;

  const path = request.nextUrl.pathname.replace(LOCALE_PREFIX, '') || '/';
  const user = await readSessionUser(request, response);

  const guestOnly = GUEST_ONLY.test(path);

  if (!guestOnly && !user) return redirectTo(request, response, '/login');
  if (guestOnly && user) return redirectTo(request, response, '/');
  return response;
}

export const config = {
  // Metadata image routes must reach crawlers directly — no i18n redirect and no login gate.
  matcher:
    '/((?!api|_next|_vercel|apple-icon|uz/opengraph-image|ru/opengraph-image|en/opengraph-image|uz/twitter-image|ru/twitter-image|en/twitter-image|.*\\..*).*)',
};
