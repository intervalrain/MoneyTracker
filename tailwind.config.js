/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rain: {
          '50': '#FCFBFB',
          '100': '#F9F7F7',
          '200': '#EAECEB',
          '300': '#DBE2EF',
          '400': '#AABACD',
          '500': '#7A93AC',
          '600': '#3F72AF',
          '700': '#2E548D',
          '800': '#1D376C',
          '900': '#112D4E',
        },
      },
    },
  },
  plugins: [],
}