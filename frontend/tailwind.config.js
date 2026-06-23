/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        ink: {
          0: "#090909",
          1: "#111111",
          2: "#181818",
          3: "#1f1f1f",
        },
        bone: {
          DEFAULT: "#F5F5F5",
          muted: "#A1A1AA",
        },
        edamen: {
          blue: "#2563EB",
          gold: "#F59E0B",
        },
      },
      fontFamily: {
        display: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Neue Montreal",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "slow-spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "reverse-slow-spin": { from: { transform: "rotate(360deg)" }, to: { transform: "rotate(0deg)" } },
        "pulse-soft": { "0%,100%": { opacity: "0.35" }, "50%": { opacity: "0.7" } },
        "drift": {
          "0%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-12px,0)" },
          "100%": { transform: "translate3d(0,0,0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slow-spin": "slow-spin 60s linear infinite",
        "reverse-slow-spin": "reverse-slow-spin 80s linear infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
        "drift": "drift 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
