/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-green": "#0899A3",
        "secondary-green": "#024356",
        "background-green": "#000F18",
      },
    },
  },
  plugins: [],
};
