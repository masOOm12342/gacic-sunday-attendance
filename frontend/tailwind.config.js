/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        church: {
          dark: '#0A192F',
          navy: '#0F172A',
          blue: '#1E3A8A',
          purple: '#4C1D95',
          violet: '#6D28D9',
          gold: '#F59E0B',
          amber: '#D97706',
          bg: '#F8FAFC',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-hover': '0 12px 40px 0 rgba(76, 29, 149, 0.25)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.4)',
        'glow-purple': '0 0 25px rgba(109, 40, 217, 0.4)',
        'card-elevate': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
