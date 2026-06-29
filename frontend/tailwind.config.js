/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0F0F0F',
          gold: '#D4AF37',
          ivory: '#F8F4E9',
          goldHover: '#B89028',
          darkGray: '#1A1A1A',
          charcoal: '#262626'
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.35)',
        'gold-glow-lg': '0 0 25px rgba(212, 175, 55, 0.5)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(to bottom, #0F0F0F, #1A1A1A)',
      }
    },
  },
  plugins: [],
}
