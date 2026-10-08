import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const tagVariants = cva(
  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-chip px-[9px] text-xs font-medium',
  {
    variants: {
      tone: {
        green: 'bg-green-100 text-green-text',
        blue: 'bg-blue-50 text-blue-text',
        neutral: 'bg-track text-ink-2',
        sunken: 'bg-surface-sunken text-ink-2',
        warning: 'bg-warning-50 text-warning-text',
        error: 'bg-error-50 text-error-text',
        success: 'bg-success-50 text-success',
        pro: 'bg-pro text-white',
      },
      size: { sm: 'h-[22px]', md: 'h-6', lg: 'h-7' },
    },
    defaultVariants: { tone: 'green', size: 'md' },
  },
);

export type TagTone = NonNullable<VariantProps<typeof tagVariants>['tone']>;
export type TagProps = ComponentProps<'span'> & VariantProps<typeof tagVariants>;

export function Tag({ tone, size, className, ...rest }: TagProps) {
  return <span className={cn(tagVariants({ tone, size }), className)} {...rest} />;
}
