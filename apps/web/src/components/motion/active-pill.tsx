'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/cn';
import { SPRING } from '@/lib/motion';

export function ActivePill({ layoutId, className }: { layoutId: string; className?: string }) {
  return <motion.span aria-hidden layoutId={layoutId} transition={SPRING} className={cn('absolute inset-0 -z-10', className)} />;
}
