import { Geist, Geist_Mono } from 'next/font/google';

export const geist = Geist({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-geist',
});

export const geistMono = Geist_Mono({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-geist-mono',
});
