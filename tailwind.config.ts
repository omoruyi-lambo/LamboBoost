import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Remove the default container — we use .site-container from globals.css
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2.5rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // shadcn/ui semantic tokens
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ── Brand palette (the new blue identity) ──────────────────────
        brand: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB", // primary blue
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        // Midnight / deep navy scale
        midnight: {
          900: "#0B1220", // dark midnight
          800: "#101A2E",
          700: "#172554", // deep blue
          600: "#1E2F56",
        },
        // Legacy alias for the pre-existing navy-* classes used across
        // dashboard/admin content pages (text-navy-900, bg-navy-900).
        navy: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E3A8A",
          900: "#0B1220", // dark navy text / button background
        },
        sky: {
          400: "#38BDF8", // sky blue accent
        },
        ink: {
          DEFAULT: "#0F172A", // primary text
          muted: "#64748B",   // secondary text
        },
        mist: "#F8FAFC",      // light background
        ice: "#EFF6FF",       // soft blue background
        line: "#E2E8F0",      // border
      },
      fontFamily: {
        sans:    ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-space-grotesk)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card:         "0 1px 3px 0 rgb(2 6 23 / 0.06), 0 1px 2px -1px rgb(2 6 23 / 0.05)",
        "card-hover": "0 4px 12px 0 rgb(2 6 23 / 0.08), 0 2px 4px -2px rgb(2 6 23 / 0.05)",
        elevated:     "0 10px 24px -4px rgb(2 6 23 / 0.1), 0 4px 8px -4px rgb(2 6 23 / 0.06)",
        product:      "0 -4px 32px rgba(2,6,23,0.1), 0 0 0 1px #E2E8F0",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to:   { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to:   { height: "0", opacity: "0" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.22s ease-out",
        "accordion-up":    "accordion-up 0.22s ease-out",
        "fade-up":         "fade-up 0.4s ease-out",
        "fade-in":         "fade-in 0.3s ease-out",
        "skeleton-pulse":  "skeleton-pulse 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};

export default config;
