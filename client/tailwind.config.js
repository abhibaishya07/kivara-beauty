/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'lb-black':  '#2A081B',
        'lb-white':  '#FFF2F8',
        'lb-blush':  '#FFD1E8',
        'lb-rose':   '#FF1493',
        'lb-mauve':  '#D1006E',
        'lb-gold':   '#FF69B4',
        'lb-gray':   '#FFE0EF',
        'lb-border': '#FFB3D9',
        'lb-dark':   '#4A153A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },
      animation: {
        fadeIn:  'fadeIn 0.4s ease-in-out',
        slideIn: 'slideIn 0.35s ease-out',
        scaleIn: 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                                          to: { opacity: '1' } },
        slideIn: { from: { transform: 'translateX(100%)' },                         to: { transform: 'translateX(0)' } },
        scaleIn: { from: { transform: 'scale(0.95)', opacity: '0' },               to: { transform: 'scale(1)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};
