import typography from '@tailwindcss/typography';

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
        forest: {
          900: '#0B2B22',
          800: '#0E3B2E',
          700: '#144C3B',
        },
        navy: {
          950: '#0A0F24',
          900: '#0F1631',
          800: '#151D3F',
        },
        battle: {
          blue: '#4C7DFF',
          orange: '#FF7A33',
          gold: '#F0B429',
        },
        mist: {
          50: '#F7F8FB',
          100: '#EEF0F5',
          200: '#E2E5ED',
        },
        ink: {
          900: '#12151C',
          700: '#2B3040',
          600: '#5B6272',
        },
      },
    },
  },
  plugins: [typography],
};
