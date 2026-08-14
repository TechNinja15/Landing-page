import type { Config } from "tailwindcss";

/**
 * Brand tokens from Brand Identity System v1.0. The three portal
 * components (landing / student / admin) currently use these as
 * inline hex values (`style={{ background: "#8B5CF6" }}`) rather
 * than Tailwind classes - that was a deliberate choice while they
 * were standalone preview artifacts with no build step to compile
 * arbitrary-value classes. Now that this is a real Next.js project
 * with a real Tailwind build, new components should prefer the
 * classes below (`bg-brand-purple`, `text-brand-aubergine`, etc.)
 * over inline styles - but nothing here requires migrating the
 * existing inline styles, they'll keep working as-is.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#8B5CF6",
          lavender: "#FCF7FF",
          gold: "#FADF63",
          orange: "#FFA552",
          midnight: "#331E38",
          aubergine: "#16001E",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "12px", // inputs, per Brand Identity System v1.0 §07
        button: "14px",
        card: "24px",
        "hero-card": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
