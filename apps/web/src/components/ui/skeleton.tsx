import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const skeletonVariants = cva('block animate-pulse rounded-[6px]', {
  variants: {
    tone: { default: 'bg-divider-muted', inverse: 'bg-white/20' },
  },
  defaultVariants: { tone: 'default' },
});

type SkeletonTone = VariantProps<typeof skeletonVariants>;

export function Skeleton({ tone, className, ...rest }: ComponentProps<'span'> & SkeletonTone) {
  return <span aria-hidden className={cn(skeletonVariants({ tone }), className)} {...rest} />;
}

export function SkeletonText({ tone, className }: SkeletonTone & { className?: string }) {
  return (
    <span aria-hidden className={cn('flex h-[1lh] items-center', className)}>
      <span className={cn(skeletonVariants({ tone }), 'h-[0.8em] w-full rounded-[4px]')} />
    </span>
  );
}
