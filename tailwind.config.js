/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen: "#69FF47",
      },
    },
  },
  plugins: [],
}

