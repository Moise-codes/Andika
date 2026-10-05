import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ANDIKA Color Palette - matching CSS variables
        'forest-primary': '#415239',
        'forest-dark': '#34442F',
        'forest-darkest': '#29372A',
        'forest-secondary': '#4A7C42',
        'forest-light': '#8FB877',
        'ivory-light': '#FAF8F5',
        'ivory-medium': '#F4F0E7',
        'ivory-dark': '#E8E8E0',
        'neutral': '#E8E5DD',
        'text-primary': '#30302E',
        'text-secondary': '#696A64',
        'border-light': '#D9D7CF',
      },
    },
  },
  plugins: [],
};
export default config;
