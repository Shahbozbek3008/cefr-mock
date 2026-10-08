import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { geist, geistMono } from '@/lib/fonts';
import { initLocale, resolveLocale, type LocaleParams } from '@/lib/i18n';
import { MotionProvider } from '@/components/motion/motion-provider';
import { AppProviders } from '@/components/providers/app-providers';
import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const t = await getTranslations({ locale: await resolveLocale(params), namespace: 'metadata' });
  return {
    title: { default: t('title'), template: `%s · CEFR Mock` },
    description: t('description'),
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, l === routing.defaultLocale ? '/' : `/${l}`])) },
  };
}

export const viewport: Viewport = { themeColor: '#FAFAFA', width: 'device-width', initialScale: 1 };

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: LocaleParams }) {
  const locale = await initLocale(params);
  return (
    <html lang={locale} className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <MotionProvider>
            <AppProviders>{children}</AppProviders>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
