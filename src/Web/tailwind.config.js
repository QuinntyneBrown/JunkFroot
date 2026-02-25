/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './projects/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        'jf-black':   '#0A0A0A',
        'jf-gold':    '#C9A84C',
        'jf-mango':   '#FF9F1C',
        'jf-sorrel':  '#9B2335',
        'jf-lime':    '#7AC74F',
        'jf-coconut': '#F5F0E8',
        'jf-dark':    '#1A1A1A',
      },
      fontFamily: {
        'display': ['"Bebas Neue"', 'sans-serif'],
        'body':    ['"Inter"', 'sans-serif'],
        'accent':  ['"Permanent Marker"', 'cursive'],
      },
    },
  },
  plugins: [],
};
