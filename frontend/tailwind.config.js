/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rugrain: {
          bg: '#F3FBF0',
          surface: '#FFFFFF',
          ink: '#122318',
          'ink-soft': '#5E6E62',
          green: '#17A34A',
          'green-deep': '#0D7C39',
          'green-pale': '#DCF6E3',
          gold: '#FFB703',
          'gold-deep': '#DB9600',
          'gold-pale': '#FFF1CC',
          blue: '#2F6FED',
          'blue-deep': '#1E52C4',
          'blue-pale': '#E3ECFE',
          red: '#EF4444',
          'red-pale': '#FDE2E2',
          line: '#E1EEDD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
