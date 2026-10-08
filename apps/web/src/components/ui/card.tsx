import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const cardVariants = cva('bg-surface', {
  variants: {
    elevation: { e0: 'shadow-e0', e1: 'shadow-e1', e2: 'shadow-e2', none: '' },
    radius: { md: 'rounded-card-sm', lg: 'rounded-card', xl: 'rounded-card-lg', hero: 'rounded-hero' },
    interactive: { true: 'transition-[translate,box-shadow] duration-(--t-sheet) ease-out-expo hover:-translate-y-0.5 hover:shadow-e2', false: '' },
  },
  defaultVariants: { elevation: 'e0', radius: 'lg', interactive: false },
});

export type CardProps = ComponentProps<'div'> & VariantProps<typeof cardVariants>;

export function Card({ elevation, radius, interactive, className, ...rest }: CardProps) {
  return <div className={cn(cardVariants({ elevation, radius, interactive }), className)} {...rest} />;
}

export function Inset({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn('rounded-2xl bg-surface-muted', className)} {...rest} />;
}
