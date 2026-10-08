'use client';

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'motion/react';
import { EASE_OUT, VIEWPORT } from '@/lib/motion';

const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  span: motion.span,
  p: motion.p,
} as unknown as Record<'div' | 'section' | 'article' | 'ul' | 'ol' | 'li' | 'span' | 'p', typeof motion.div>;

type MotionTagProps = HTMLMotionProps<'div'> & { as?: keyof typeof TAGS };

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE_OUT } },
};

type RevealProps = MotionTagProps & { delay?: number; y?: number };

export function Reveal({ as = 'div', delay = 0, y = 18, ...rest }: RevealProps) {
  const Component = TAGS[as];
  const reduced = useReducedMotion();
  return (
    <Component
      initial={reduced ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      {...rest}
    />
  );
}

type StaggerProps = MotionTagProps & { step?: number; delay?: number };

export function Stagger({ as = 'div', step = 0.08, delay = 0, ...rest }: StaggerProps) {
  const Component = TAGS[as];
  const reduced = useReducedMotion();
  return (
    <Component
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: step, delayChildren: delay } } }}
      {...rest}
    />
  );
}

export function StaggerItem({ as = 'div', ...rest }: MotionTagProps) {
  const Component = TAGS[as];
  return <Component variants={revealVariants} {...rest} />;
}
