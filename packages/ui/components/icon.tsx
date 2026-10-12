import type { LucideIcon, LucideProps } from 'lucide-react';

type IconProps = Omit<LucideProps, 'ref'> & { as: LucideIcon };

export function Icon({ as: Component, size = 18, strokeWidth = 1.6, ...rest }: IconProps) {
  return <Component size={size} strokeWidth={strokeWidth} aria-hidden {...rest} />;
}
