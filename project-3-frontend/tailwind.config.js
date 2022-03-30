module.exports = {
  content: [
    "./public/index.html",
    "./src/components/**/*.{html,js}",
    "./src/pages/**/*.{html,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
