import type { Config } from "tailwindcss";
import { createPreset } from "fumadocs-ui/tailwind-plugin";

const config: Config = {
  darkMode: "class",
  presets: [
    createPreset({
      cssPrefix: "fd",
    }),
  ],
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./content/**/*.mdx",
    "./node_modules/fumadocs-ui/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        vinr: {
          50:  "#f7fdfc",
          100: "#e7f7f7",
          200: "#c6e8e8",
          300: "#97d1d1",
          500: "#2a9d90",
          700: "#0b3b45",
          800: "#082d35",
          900: "#05191d",
        },
        zinc: {
          50:   "#fafafa",
          100:  "#f8f9f9",
          200:  "#f4f6f6",
          400:  "#eceff0",
          600:  "#d2d6d7",
          700:  "#a4a7a8",
          800:  "#7f8182",
          900:  "#616363",
          950:  "#2c2e2e",
        },
        lime: {
          500: "#6da544",
          700: "#496e2d",
          900: "#225f47",
        },
        blue: {
          500: "#338af3",
          700: "#0052b4",
        },
        yellow:    "#ffda44",
        red:       "#d80027",
        "red-deep":"#a2001d",
        purple:    "#9747ff",

        /* fumadocs semantic bindings */
        border:     "hsl(var(--fd-border))",
        background: "hsl(var(--fd-background))",
        foreground: "hsl(var(--fd-foreground))",
        muted: {
          DEFAULT:    "hsl(var(--fd-muted))",
          foreground: "hsl(var(--fd-muted-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--fd-card))",
          foreground: "hsl(var(--fd-card-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--fd-accent))",
          foreground: "hsl(var(--fd-accent-foreground))",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono:    ["var(--font-roboto-mono)", "Roboto Mono", "ui-monospace", "monospace"],
        display: ["Caveat", "cursive"],
      },
      borderRadius: {
        sm:   "4px",
        md:   "6px",
        lg:   "8px",
        xl:   "12px",
        full: "9999px",
      },
      boxShadow: {
        xs:         "0 1px 2px 0 rgba(0,0,0,0.05)",
        sm:         "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
        md:         "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
        lg:         "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        card:       "0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(11,59,69,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
