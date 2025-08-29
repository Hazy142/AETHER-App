/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{src,components}/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      colors: {
        'brand-bg': '#0a0a0f',
        'brand-surface': '#1a1a21',
        'brand-outline': '#2a2a33',
        'brand-text': '#e0e0ff',
        'brand-text-muted': '#8a8aa0',
      }
    }
  },
  plugins: [],
}