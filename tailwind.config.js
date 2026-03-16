/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#c03f0c',
        'background-light': '#fdfaf7',
        'background-dark': '#3c1e08',
        espresso: '#3c1e08',
        'accent-soft': '#fef2ed',
        'success-bg': '#dcfce7',
        'success-text': '#166534',
      },
      fontFamily: {
        display: ['"Work Sans"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
