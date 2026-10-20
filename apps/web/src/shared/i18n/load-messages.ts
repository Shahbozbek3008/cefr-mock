import type { Locale } from '@cefr/ui/i18n/locales';
import type messages from '@/shared/i18n/messages/uz.json';

type Messages = typeof messages;

const loaders: Record<Locale, () => Promise<{ default: Messages }>> = {
  uz: () => import('@/shared/i18n/messages/uz.json'),
  ru: () => import('@/shared/i18n/messages/ru.json'),
  en: () => import('@/shared/i18n/messages/en.json'),
};

const cache = new Map<Locale, Promise<Messages>>();

export function loadMessages(locale: Locale) {
  const cached = cache.get(locale);
  if (cached) return cached;
  const pending = loaders[locale]().then((module) => module.default);
  cache.set(locale, pending);
  return pending;
}
