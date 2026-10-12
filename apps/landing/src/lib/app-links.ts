import { useLocale } from 'next-intl';
import { routing } from '@cefr/ui/i18n/routing';
import { APP_ROUTES, APP_URL } from './constants';

type AppLinks = Record<keyof typeof APP_ROUTES, string>;

export function useAppLinks(): AppLinks {
  const locale = useLocale();
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return {
    login: `${APP_URL}${prefix}${APP_ROUTES.login}`,
    start: `${APP_URL}${prefix}${APP_ROUTES.start}`,
  };
}
