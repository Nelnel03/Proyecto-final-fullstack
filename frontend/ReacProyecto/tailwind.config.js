/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        sand: 'var(--color-sand)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
        olive: 'var(--color-olive)',
        earth: 'var(--color-earth)',
        moss: 'var(--color-moss)',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      animation: {
        'wave-slow': 'wave 20s cubic-bezier( 0.36, 0.45, 0.63, 0.53) infinite',
        'wave-medium': 'wave 15s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -2s infinite',
        'wave-fast': 'wave 12s cubic-bezier( 0.36, 0.45, 0.63, 0.53) -4s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
