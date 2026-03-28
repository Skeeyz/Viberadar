/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vibe-cyan': '#06b6d4',
        'vibe-orange': '#f97316',
      },
    },
  },
  plugins: [],
}