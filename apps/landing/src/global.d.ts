import type { routing } from '@cefr/ui/i18n/routing';
import type messages from '@/messages/uz.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
