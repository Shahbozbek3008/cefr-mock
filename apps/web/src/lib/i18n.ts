import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';

export type LocaleParams = Promise<{ locale: string }>;
export type PageProps<P extends object = object> = { params: Promise<{ locale: string } & P> };

export async function resolveLocale(params: LocaleParams): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}

export async function initLocale(params: LocaleParams): Promise<Locale> {
  const locale = await resolveLocale(params);
  setRequestLocale(locale);
  return locale;
}

export function metadataTitle(key: string) {
  return async ({ params }: { params: LocaleParams }): Promise<Metadata> => {
    const t = await getTranslations({ locale: await resolveLocale(params) });
    return { title: t(key as never) };
  };
}
