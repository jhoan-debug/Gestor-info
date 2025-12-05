// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FFD700", // amarillo principal
          dark: "#c9b24a",
          background: "#0b0b0b",
          panel: "#070707",
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-amber': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '.6' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up .35s ease-out both',
        'pulse-amber': 'pulse-amber 2s ease-in-out infinite',
        'slide-left': 'slide-left .4s ease both',
      },
      boxShadow: {
        'glow-amber': '0 8px 24px rgba(255,215,0,0.06)'
      }
    },
  },
  plugins: [],
}
