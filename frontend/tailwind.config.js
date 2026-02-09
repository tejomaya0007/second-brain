/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
    darkMode: ["class"],
  theme: {
    extend: {
        colors: {
          background: "hsl(var(--background))",
          surface: "hsl(var(--surface))",
          "surface-elevated": "hsl(var(--surface-elevated))",
          border: "hsl(var(--border))",
          "border-glow": "hsl(var(--border-glow))",
          brand: {
            background: "hsl(var(--background))",
            surface: "hsl(var(--surface))",
            "surface-elevated": "hsl(var(--surface-elevated))",
            border: "hsl(var(--border))",
            "border-glow": "hsl(var(--border-glow))",
          },
            accent: {
              one: "#8b5cf6",
              two: "#ec4899",
              three: "#f97316",
              four: "#06b6d4",
            },
        },
      fontFamily: {
        sans: ["Inter", "Geist", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
          "50%": { opacity: 0.7, boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}
