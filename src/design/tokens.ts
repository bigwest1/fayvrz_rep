export const spacing = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  xxl: "3rem",
} as const;

export const radii = {
  sm: "0.5rem",
  md: "0.85rem",
  lg: "1.25rem",
  pill: "999px",
} as const;

export const shadows = {
  subtle: "0 8px 24px rgba(15, 23, 32, 0.08)",
  soft: "0 12px 32px rgba(15, 23, 32, 0.12)",
} as const;

export const typography = {
  display: "clamp(2.3rem, 2.2vw + 1rem, 3rem)",
  headline: "clamp(1.6rem, 1.5vw + 1rem, 2.3rem)",
  section: "1.25rem",
  body: "1rem",
  meta: "0.8rem",
} as const;

export const colors = {
  canvas: "#f4f1e9",
  surface: "#ffffff",
  surfaceMuted: "#eeeadf",
  text: "#111418",
  textMuted: "#343a40",
  border: "#ddd4c5",
  borderStrong: "#c7baa6",
  success: "#0f7a4f",
  warn: "#b76b00",
  error: "#a12a2a",
  info: "#1d5aa7",
} as const;

export const motion = {
  fast: 0.14,
  base: 0.2,
  gentle: 0.28,
  easing: {
    standard: [0.33, 1, 0.68, 1],
    subtle: [0.25, 0.46, 0.45, 0.94],
    entrance: [0.22, 0.61, 0.36, 1],
  },
} as const;
