'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { SOFT_SPRING } from '@/lib/motion';

export function ScrollTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] });
  const progress = useSpring(scrollYProgress, SOFT_SPRING);
  const rotateX = useTransform(progress, [0, 1], [22, 0]);
  const scale = useTransform(progress, [0, 1], [0.92, 1]);
  const opacity = useTransform(progress, [0, 0.6], [0.4, 1]);

  return (
    <div ref={ref} className="[perspective:1600px]">
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: '50% 0%' }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}
