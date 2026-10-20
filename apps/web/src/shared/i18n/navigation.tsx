import { createContext, use, useMemo, useState, useTransition, type MouseEvent } from 'react';
import { Navigate, Link as RouterLink, useLocation, useNavigate } from 'react-router';
import { useLocale } from 'use-intl';
import { delocalizePath, localizePath, type Locale } from '@cefr/ui/i18n/locales';
import type { LocaleSwitch, NavigationAdapter, NavigationLinkProps } from '@cefr/ui/navigation/navigation-context';

const EXTERNAL_HREF = /^[a-z][a-z\d+.-]*:/i;

const LinkPendingContext = createContext(false);

const isPlainClick = (event: MouseEvent<HTMLAnchorElement>) =>
  !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

export function Link({ href, locale, replace, onClick, target, children, ...rest }: NavigationLinkProps) {
  const currentLocale = useLocale();
  const { key } = useLocation();
  const [clickedAt, setClickedAt] = useState<string | null>(null);

  if (EXTERNAL_HREF.test(href)) {
    return (
      <a href={href} onClick={onClick} target={target} {...rest}>
        {children}
      </a>
    );
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (isPlainClick(event) && (!target || target === '_self')) setClickedAt(key);
  };

  return (
    <LinkPendingContext value={clickedAt === key}>
      <RouterLink to={localizePath(href, locale ?? currentLocale)} replace={replace} onClick={handleClick} target={target} {...rest}>
        {children}
      </RouterLink>
    </LinkPendingContext>
  );
}

export function usePathname() {
  return delocalizePath(useLocation().pathname);
}

export function useRouter() {
  const navigate = useNavigate();
  const locale = useLocale();

  return useMemo(
    () => ({
      push: (href: string) => navigate(localizePath(href, locale)),
      replace: (href: string) => navigate(localizePath(href, locale), { replace: true }),
    }),
    [navigate, locale],
  );
}

export function LocalizedNavigate({ to }: { to: string }) {
  return <Navigate to={localizePath(to, useLocale())} replace />;
}

export function DefaultLocaleRedirect() {
  const { pathname, search, hash } = useLocation();
  return <Navigate to={`${delocalizePath(pathname)}${search}${hash}`} replace />;
}

function useRouterLinkPending() {
  return use(LinkPendingContext);
}

function useRouterLocaleSwitch(): LocaleSwitch {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const [pending, startTransition] = useTransition();

  const switchLocale = (locale: Locale) =>
    startTransition(() => navigate(`${localizePath(delocalizePath(pathname), locale)}${search}${hash}`, { replace: true }));

  return { switchLocale, pending };
}

export const routerNavigationAdapter: NavigationAdapter = {
  Link,
  useLinkPending: useRouterLinkPending,
  useLocaleSwitch: useRouterLocaleSwitch,
};
