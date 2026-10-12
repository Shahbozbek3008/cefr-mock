import { ImageResponse } from 'next/og';
import { APPLE_ICON_SIZE } from '@/constants/seo';
import { LogoMarkImage } from '@/lib/og-image';

export const size = APPLE_ICON_SIZE;
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(<LogoMarkImage size={APPLE_ICON_SIZE.width} rounded={false} />, APPLE_ICON_SIZE);
}
