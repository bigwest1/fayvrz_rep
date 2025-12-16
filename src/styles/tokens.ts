export const colors = {
  canvas: "#f6f4f0",
  surface: "#ffffff",
  surfaceMuted: "#f1eee7",
  border: "#e3dfd6",
  borderStrong: "#cfc9bc",
  text: "#0f1115",
  textMuted: "#2f3239",
  accentCalm: "#dfe9e2",
  accentContrast: "#111827",
} as const;

export const spacing = {
  xs: "0.375rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.75rem",
} as const;

export const radii = {
  xs: "0.35rem",
  sm: "0.55rem",
  md: "0.85rem",
  lg: "1.15rem",
  xl: "1.5rem",
} as const;

export const elevation = {
  subtle: "0 6px 18px rgba(17, 24, 39, 0.05)",
  lifted: "0 10px 28px rgba(17, 24, 39, 0.08)",
  overlay: "0 16px 44px rgba(17, 24, 39, 0.12)",
} as const;

export const motion = {
  durations: {
    fast: "120ms",
    base: "180ms",
    gentle: "240ms",
  },
  easing: {
    standard: "cubic-bezier(0.33, 1, 0.68, 1)",
    subtle: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    entrance: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  },
  prefersReduced: "(prefers-reduced-motion: reduce)",
} as const;
