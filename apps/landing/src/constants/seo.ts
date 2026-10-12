import type { Locale } from '@cefr/ui/i18n/routing';

const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelProductionHost ? `https://${vercelProductionHost}` : 'http://localhost:3001')
).replace(/\/+$/, '');

export const OG_LOCALES = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' } as const satisfies Record<Locale, string>;

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const APPLE_ICON_SIZE = { width: 180, height: 180 } as const;

export const SEARCH_VERIFICATION = {
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
} as const;

export const PRICE_CURRENCY = 'UZS';
