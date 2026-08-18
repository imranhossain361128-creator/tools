/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0D0F14',
          900: '#12151C',
          800: '#1A1E28',
          700: '#242938',
          600: '#333A4D',
        },
        battle: {
          blue: '#3E7BFA',
          orange: '#FF7A33',
        },
        mist: {
          50: '#F7F8FB',
          100: '#EEF0F5',
          200: '#E2E5ED',
        },
      },
    },
  },
  plugins: [],
};
