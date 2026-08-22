/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festival: {
          cream: '#FAF6F0',
          creamDark: '#F4ECE1',
          maroon: '#7A1C1C',
          maroonDark: '#5E1212',
          orange: '#E07A5F',
          saffron: '#F59E0B',
          gold: '#D4AF37',
          goldLight: '#E8C85C',
          dark: '#2E2925',
          darkLight: '#4E4640',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
