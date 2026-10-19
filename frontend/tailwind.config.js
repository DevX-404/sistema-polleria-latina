/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polleria: {
          red: '#E52E2E',
          'red-hover': '#DC2626',
          'red-light': '#FEF2F2',
          'red-subtle': '#FEE2E2',
          dark: '#1C1D1F',
          'dark-surface': '#252629',
          'dark-card': '#2A2C30',
          'dark-hover': '#323438',
          accent: '#F59E0B',
          yellow: '#F1C40F',
          bg: '#F6F7F9',
          card: '#FFFFFF',
          border: '#E5E7EB',
          text: '#111827',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'glow-red': '0 0 20px -2px rgba(229, 46, 46, 0.35)',
        'glow-amber': '0 0 20px -2px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
}
