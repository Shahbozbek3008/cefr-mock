import type { Transition } from "motion/react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const SPRING: Transition = {
  type: "spring",
  bounce: 0.18,
  duration: 0.55,
};

export const SOFT_SPRING = { stiffness: 120, damping: 20, mass: 0.6 } as const;

export const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;
