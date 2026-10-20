import type { Locale } from '@cefr/ui/i18n/locales';
import type messages from '@/shared/i18n/messages/uz.json';

declare module 'use-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
