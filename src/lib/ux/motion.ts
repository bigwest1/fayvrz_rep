import { useReducedMotion } from "framer-motion";

export const motionTokens = {
  durations: {
    fast: 0.15,
    base: 0.24,
    slow: 0.36,
  },
  easings: {
    subtle: [0.25, 0.1, 0.25, 1],
    entrance: [0.16, 1, 0.3, 1],
    exit: [0.4, 0, 0.2, 1],
  },
  stagger: {
    list: 0.04,
  },
};

export function useMotionSafe() {
  const reduced = useReducedMotion();
  return {
    disabled: reduced,
    duration: reduced ? 0 : motionTokens.durations.base,
    transition: {
      duration: reduced ? 0 : motionTokens.durations.base,
      ease: motionTokens.easings.subtle,
    },
  };
}
