const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{ts,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        current: "currentColor",
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        gray: colors.neutral,
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    plugin(function ({addVariant, e}) {
      addVariant("collapsed", ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
          return `.collapsed .${e(`collapsed${separator}${className}`)}`;
        });
      });
      addVariant("rtl", ({modifySelectors, separator}) => {
        modifySelectors(({className}) => {
          return `.rtl .${e(`rtl${separator}${className}`)}`;
        });
      });
    }),
  ],
};
