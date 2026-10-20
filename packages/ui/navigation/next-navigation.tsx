'use client';

import { useTransition, type ReactNode } from 'react';
import { useLinkStatus } from 'next/link';
import { Link, usePathname, useRouter } from '../i18n/navigation';
import type { Locale } from '../i18n/locales';
import { NavigationProvider, type LocaleSwitch, type NavigationAdapter } from './navigation-context';

function useNextLinkPending() {
  return useLinkStatus().pending;
}

function useNextLocaleSwitch(): LocaleSwitch {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const switchLocale = (locale: Locale) => startTransition(() => router.replace(pathname, { locale }));
  return { switchLocale, pending };
}

const nextNavigationAdapter: NavigationAdapter = {
  Link,
  useLinkPending: useNextLinkPending,
  useLocaleSwitch: useNextLocaleSwitch,
};

export function NextNavigationProvider({ children }: { children: ReactNode }) {
  return <NavigationProvider adapter={nextNavigationAdapter}>{children}</NavigationProvider>;
}
