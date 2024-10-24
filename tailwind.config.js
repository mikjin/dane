/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#006A6A',
          light: '#4B9696',
          dark: '#004040',
        },
        'secondary': {
          DEFAULT: '#4A6363',
          light: '#778F8F',
          dark: '#1F3939',
        },
        'surface': {
          DEFAULT: '#FAFDFC',
          container: '#FFFFFF',
        },
        'error': {
          DEFAULT: '#BA1A1A',
          light: '#FFB4AB',
          dark: '#93000A',
        }
      },
      borderRadius: {
        'material': '28px',
        'material-sm': '16px',
        'material-lg': '100px',
      },
      boxShadow: {
        'material': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
      }
    },
  },
  plugins: [],
};