/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'desa-primary': '#1e3a8a', // Biru Navy Luxury
      }
    },
  },
  plugins: [],
}