import { motion as motionTokens } from "@/styles/tokens";

export const durations = {
  fast: motionTokens.durations.fast,
  base: motionTokens.durations.base,
  gentle: motionTokens.durations.gentle,
} as const;

export const easing = {
  standard: motionTokens.easing.standard,
  subtle: motionTokens.easing.subtle,
  entrance: motionTokens.easing.entrance,
} as const;

export const prefersReducedMotionQuery = motionTokens.prefersReduced;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(prefersReducedMotionQuery).matches;
}
