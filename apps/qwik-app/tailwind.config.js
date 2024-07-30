/** @type {import('tailwindcss').Config} */
const { tailwindConfig } = require('@storefront-ui/tailwind-config');

export default {
  presets: [tailwindConfig],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './node_modules/qwik-storefront-ui/**/*.{cjs,mjs}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
