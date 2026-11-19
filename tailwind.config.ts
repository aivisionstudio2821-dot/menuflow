import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080A0C",
        "background-secondary": "#0D1115",
        surface: {
          DEFAULT: "#12171C",
          elevated: "#171D23",
          hover: "#1A2229",
        },
        border: "rgba(255, 255, 255, 0.08)",
        "border-strong": "rgba(255, 255, 255, 0.14)",
        primary: {
          DEFAULT: "#F5F2EA",
          muted: "#9BA3AA",
          dark: "#080A0C",
        },
        accent: {
          DEFAULT: "#2DD4BF",
          hover: "#14B8A6",
          subtle: "rgba(45, 212, 191, 0.12)",
        },
        champagne: {
          DEFAULT: "#E7C77A",
          hover: "#D4B365",
          subtle: "rgba(231, 199, 122, 0.12)",
        },
        success: {
          DEFAULT: "#34D399",
          subtle: "rgba(52, 211, 153, 0.12)",
        },
        danger: {
          DEFAULT: "#F87171",
          subtle: "rgba(248, 113, 113, 0.12)",
        },
        warning: {
          DEFAULT: "#FBBF24",
          subtle: "rgba(251, 191, 36, 0.12)",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        glow: "0 0 25px -5px rgba(45, 212, 191, 0.15)",
        "glow-gold": "0 0 25px -5px rgba(231, 199, 122, 0.15)",
        elevated: "0 10px 30px -5px rgba(0, 0, 0, 0.6)",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        float: "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
