import { use, useEffect } from 'react';
import { Outlet } from 'react-router';
import { IntlProvider } from 'use-intl';
import type { Locale } from '@cefr/ui/i18n/locales';
import { NavigationProvider } from '@cefr/ui/navigation/navigation-context';
import { TIME_ZONE } from '@/shared/i18n/constants';
import { rememberLocale } from '@/shared/i18n/locale-detection';
import { loadMessages } from '@/shared/i18n/load-messages';
import { routerNavigationAdapter } from '@/shared/i18n/navigation';

export function LocaleRoot({ locale }: { locale: Locale }) {
  const messages = use(loadMessages(locale));

  useEffect(() => {
    document.documentElement.lang = locale;
    rememberLocale(locale);
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages} timeZone={TIME_ZONE}>
      <NavigationProvider adapter={routerNavigationAdapter}>
        <Outlet />
      </NavigationProvider>
    </IntlProvider>
  );
}
