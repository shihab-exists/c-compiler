/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Satoshi", "Gilroy", "Montserrat", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "Consolas", "monospace"],
      },
      colors: {
        navy: {
          50: "#EDF1F6",
          100: "#D0E3FF",
          200: "#7096D1",
          300: "#3B6CB5",
          400: "#15428A",
          500: "#081F5C",
          600: "#061848",
          700: "#041235",
          800: "#020C21",
          900: "#010610",
        },
        accent: {
          50: "#EDF1F6",
          100: "#D0E3FF",
          200: "#7096D1",
          300: "#4B4EFC",
          400: "#1E22FB",
          500: "#0408E7",
          600: "#0306BA",
          700: "#02058D",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        neutral: {
          50: "#F3F4F6",
          100: "#E5E7EB",
          200: "#D1D5DB",
          300: "#9FAFBF",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 8px 32px rgba(8, 31, 92, 0.08)",
        glow: "0 0 40px rgba(112, 150, 209, 0.25)",
        card: "0 4px 24px rgba(8, 31, 92, 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: 0, transform: "translateX(-12px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
