/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F38F6',
          50: '#EEEEFF',
          100: '#DDD DDff',
          600: '#4F38F6',
          700: '#3824D4',
        },
        brand: {
          purple: '#4F38F6',
          pink: '#F5339A',
          indigo: '#6160FF',
          'light-purple': '#EEF0FF',
          'light-pink': '#FEE8F3',
          'light-amber': '#FEF3C7',
        },
        text: {
          dark: '#0F1729',
          secondary: '#627490',
        },
        border: {
          DEFAULT: '#E2EBF0',
        },
      },
      backgroundImage: {
        'name-gradient': 'linear-gradient(90deg, #F5339A 0%, #AD47FF 50%, #6160FF 100%)',
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.04)',
        nav: '0 2px 12px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        '2.5xl': '20px',
      },
    },
  },
  plugins: [],
}
