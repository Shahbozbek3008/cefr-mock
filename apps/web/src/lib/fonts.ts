import { Geist_Mono, Onest } from 'next/font/google';

export const onest = Onest({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  display: 'swap',
  variable: '--font-onest',
});

export const geistMono = Geist_Mono({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-geist-mono',
});
