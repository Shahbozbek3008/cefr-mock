import { Link as RouterLink } from 'react-router';
import type { LocaleSwitch, NavigationAdapter, NavigationLinkProps } from '@cefr/ui/navigation/navigation-context';
import { useLocaleControl } from './locale-provider';

function Link({ href, locale: _locale, replace, ...rest }: NavigationLinkProps) {
  return <RouterLink to={href} replace={replace} {...rest} />;
}

const useLinkPending = () => false;

const useLocaleSwitch = (): LocaleSwitch => {
  const { setLocale } = useLocaleControl();
  return { switchLocale: setLocale, pending: false };
};

export const navigationAdapter: NavigationAdapter = { Link, useLinkPending, useLocaleSwitch };
