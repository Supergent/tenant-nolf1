/**
 * Tailwind Preset
 * Shared Tailwind configuration using design tokens
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#ffffff",
          emphasis: "#4338ca",
        },
        secondary: {
          DEFAULT: "#0ea5e9",
          foreground: "#0f172a",
          emphasis: "#0284c7",
        },
        accent: {
          DEFAULT: "#f97316",
          foreground: "#0f172a",
          emphasis: "#ea580c",
        },
        success: {
          DEFAULT: "#16a34a",
          foreground: "#022c22",
          emphasis: "#15803d",
        },
        warning: {
          DEFAULT: "#facc15",
          foreground: "#422006",
          emphasis: "#eab308",
        },
        danger: {
          DEFAULT: "#ef4444",
          foreground: "#450a0a",
          emphasis: "#dc2626",
        },
        background: "#f8fafc",
        surface: "#ffffff",
        muted: "#e2e8f0",
        "text-primary": "#0f172a",
        "text-secondary": "#475569",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        pill: "999px",
      },
      fontFamily: {
        sans: ["Inter", "Inter Variable", "system-ui", "sans-serif"],
        headings: ["Plus Jakarta Sans", "Inter Variable", "sans-serif"],
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "22px",
        "2xl": "28px",
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(15, 23, 42, 0.08)",
        md: "0 10px 25px -15px rgba(15, 23, 42, 0.25)",
        lg: "0 18px 40px -20px rgba(15, 23, 42, 0.35)",
      },
      transitionTimingFunction: {
        "app-ease": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "28px",
        "2xl": "40px",
      },
    },
  },
  plugins: [],
};
