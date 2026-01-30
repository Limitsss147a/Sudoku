/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "cell-pop": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "cell-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "75%": { transform: "translateX(2px)" }
        },
        "success-wave": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" }
        }
      },
      animation: {
        "cell-pop": "cell-pop 0.2s ease-out",
        "cell-shake": "cell-shake 0.3s ease-in-out",
        "success-wave": "success-wave 0.5s ease-in-out"
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        sudoku: {
          fixed: "#000000",
          "fixed-bg": "#e2e8f0",
          input: "#2563eb", 
          "input-bg": "#ffffff",
          trial: "#9333ea",
          "trial-bg": "#f3e8ff",
          success: "#16a34a",
          "success-bg": "#dcfce7",
          error: "#dc2626",
        }
      }
    },
  },
  plugins: [],
}