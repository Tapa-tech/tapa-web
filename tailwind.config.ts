import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "serif"],
      },
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        dark: "var(--dark)",
        pink: "var(--pink)",
        amber: "var(--amber)",
        "amber-light": "var(--amber-light)",
        "amber-border": "var(--amber-border)",
        "amber-text": "var(--amber-text)",
        gold: "var(--gold)",
        "body-text": "var(--body-text)",
        "mid-text": "var(--mid-text)",
        "sub-text": "var(--sub-text)",
        border: "var(--border)",
        "hero-text": "var(--hero-text)",
        dim: "var(--dim)",
        dimmer: "var(--dimmer)",
        "green-bg": "var(--green-bg)",
        "green-text": "var(--green-text)",
        "green-border": "var(--green-border)",
        "red-light": "var(--red-light)",
        "red-mid": "var(--red-mid)",
      },
    },
  },
  plugins: [],
};
export default config;
