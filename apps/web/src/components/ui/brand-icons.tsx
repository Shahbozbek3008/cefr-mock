import type { SVGProps } from 'react';

type BrandIconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number };

export function TelegramIcon({ size = 16, ...rest }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...rest}>
      <path d="M20.67 3.39a1.5 1.5 0 0 1 2.05 1.66l-2.93 14.6a1.5 1.5 0 0 1-2.34.93l-4.62-3.33-2.33 2.25a.75.75 0 0 1-1.25-.36l-1.33-4.55-4.4-1.42a1 1 0 0 1-.06-1.88L20.67 3.39Zm-3.12 4.3-8.12 5.86.9 3.07.26-2.32a.75.75 0 0 1 .25-.48l6.71-6.13Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 16, ...rest }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
