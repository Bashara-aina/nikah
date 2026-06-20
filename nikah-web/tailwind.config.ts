import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "var(--color-ink)",
        paper: "var(--color-paper)",
        blush: "var(--color-blush)",
        cream: "var(--color-cream)",
        sage: "var(--color-sage)",
        gold: "var(--color-gold)",
        muted: "var(--color-muted)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
      },
      letterSpacing: {
        tightish: "-0.01em",
        editorial: "-0.02em",
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
};

export default config;