'use client';

import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import { SOFT_SPRING } from '@/lib/motion';

type Pointer = { x: MotionValue<number>; y: MotionValue<number> };

const PointerContext = createContext<Pointer | null>(null);

export function ParallaxScene({ className, children }: { className?: string; children: ReactNode }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SOFT_SPRING);
  const y = useSpring(rawY, SOFT_SPRING);

  return (
    <PointerContext.Provider value={{ x, y }}>
      <div
        className={className}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          rawX.set((e.clientX - rect.left) / rect.width - 0.5);
          rawY.set((e.clientY - rect.top) / rect.height - 0.5);
        }}
        onPointerLeave={() => {
          rawX.set(0);
          rawY.set(0);
        }}
      >
        {children}
      </div>
    </PointerContext.Provider>
  );
}

type ParallaxLayerProps = Omit<ComponentProps<typeof motion.div>, 'style'> & { depth?: number; tilt?: number };

export function ParallaxLayer({ depth = 16, tilt = 0, ...rest }: ParallaxLayerProps) {
  const pointer = useContext(PointerContext);
  const fallback = useMotionValue(0);
  const px = pointer?.x ?? fallback;
  const py = pointer?.y ?? fallback;
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth);
  const rotateY = useTransform(px, (v) => v * tilt);
  const rotateX = useTransform(py, (v) => v * -tilt);

  return <motion.div style={{ x, y, rotateX, rotateY, transformPerspective: 1200 }} {...rest} />;
}
