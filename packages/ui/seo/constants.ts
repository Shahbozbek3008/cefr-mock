import type { Metadata } from 'next';
import { BRAND_NAME } from '../components/logo';
import type { Locale } from '../i18n/routing';

export const OG_LOCALES = { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' } as const satisfies Record<Locale, string>;

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const OG_IMAGE_ALT = `${BRAND_NAME} — CEFR mock tests with AI scoring`;

export const APPLE_ICON_SIZE = { width: 180, height: 180 } as const;

export const PRICE_CURRENCY = 'UZS';

export const INDEXABLE_ROBOTS = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
} as const satisfies Metadata['robots'];

export const PRIVATE_ROBOTS = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
} as const satisfies Metadata['robots'];
