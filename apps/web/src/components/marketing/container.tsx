import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function Container({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-page px-5 md:px-8', className)} {...rest} />;
}
