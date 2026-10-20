'use client';

import { createContext, use, type ComponentProps, type ComponentType, type ReactNode } from 'react';
import type { Locale } from '../i18n/locales';

export type NavigationLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
  href: string;
  locale?: Locale;
  replace?: boolean;
};

export interface LocaleSwitch {
  switchLocale: (locale: Locale) => void;
  pending: boolean;
}

export interface NavigationAdapter {
  Link: ComponentType<NavigationLinkProps>;
  useLinkPending: () => boolean;
  useLocaleSwitch: () => LocaleSwitch;
}

interface NavigationProviderProps {
  adapter: NavigationAdapter;
  children: ReactNode;
}

const NavigationContext = createContext<NavigationAdapter | null>(null);

export function NavigationProvider({ adapter, children }: NavigationProviderProps) {
  return <NavigationContext value={adapter}>{children}</NavigationContext>;
}

export function useNavigationAdapter() {
  const adapter = use(NavigationContext);
  if (!adapter) throw new Error('useNavigationAdapter must be used within NavigationProvider');
  return adapter;
}
