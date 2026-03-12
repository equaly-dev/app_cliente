/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f18',
        surface: '#0d1320',
        surfaceDark: '#0b0f19',
        card: '#161c2b',
        borderC: '#1e293b',
        accent: '#3b82f6',
        accentHover: '#2563eb',
      }
    },
  },
  plugins: [],
}
