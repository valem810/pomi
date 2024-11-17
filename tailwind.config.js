/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'navbar-height': '4rem', // Ajusta según la altura de tu navbar
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'], // Define el nombre de la fuente
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}


