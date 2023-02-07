/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        extreme: "999px",
        cl: "50%",
      },
      spacing: {
        stretch: "stretch",
      },
    },
  },
  plugins: [],
};
