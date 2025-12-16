export const colors = {
  canvas: "#f4f1e9",
  surface: "#ffffff",
  surfaceMuted: "#eeeadf",
  border: "#ddd4c5",
  borderStrong: "#c7baa6",
  text: "#111418",
  textMuted: "#343a40",
  accentCalm: "#d9e4dc",
  accentContrast: "#0f1720",
} as const;

export const spacing = {
  xs: "0.4rem",
  sm: "0.75rem",
  md: "1.1rem",
  lg: "1.6rem",
  xl: "2.15rem",
  "2xl": "2.85rem",
} as const;

export const radii = {
  xs: "0.35rem",
  sm: "0.65rem",
  md: "0.95rem",
  lg: "1.2rem",
  xl: "1.45rem",
} as const;

export const elevation = {
  subtle: "0 5px 16px rgba(15, 23, 32, 0.05)",
  lifted: "0 10px 28px rgba(15, 23, 32, 0.08)",
  overlay: "0 16px 42px rgba(15, 23, 32, 0.12)",
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
