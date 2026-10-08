import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { readSessionUser } from './lib/supabase/session';

const intl = createMiddleware(routing);

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`);
const PROTECTED = /^\/app(\/|$)/;
const GUEST_ONLY = /^\/(login|start)(\/|$)/;

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

  if (PROTECTED.test(path) && !user) return redirectTo(request, response, '/login');
  if (GUEST_ONLY.test(path) && user) return redirectTo(request, response, '/app');
  return response;
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
