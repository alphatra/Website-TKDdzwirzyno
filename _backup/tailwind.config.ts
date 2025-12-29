import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // "Sea": Deep, serious navies
        primary: {
          DEFAULT: "#FF5500", // Energetic Orange
          // Keeping legacy values for compatibility if needed, but DEFAULT is the main one
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        "background-light": "#F8FAFC",
        "background-dark": "#0F172A",
        "card-light": "#FFFFFF",
        "card-dark": "#1E293B",
        "gold": "#EAB308",
        "silver": "#94A3B8",
        "bronze": "#B45309",
        // "Claw": Sharp, energetic orange-red
        secondary: {
          DEFAULT: "#ea580c", // Orange-600 like
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        // Legacy support mapping
        accent: {
          DEFAULT: "#ea580c",
          400: "#fb923c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Orbitron", "Outfit", "system-ui", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "avant": "0 10px 40px -10px rgba(0, 0, 0, 0.05)",
        "glow": "0 0 15px rgba(255, 85, 0, 0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "claw-swipe": "clawSwipe 0.3s ease-in-out",
        "float": "float 6s ease-in-out infinite",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        clawSwipe: {
          "0%": { transform: "translateX(-10px) rotate(-5deg)" },
          "50%": { transform: "translateX(5px) rotate(5deg)" },
          "100%": { transform: "translateX(0) rotate(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".5" },
        },
      },
    },
  },
} as Config;
