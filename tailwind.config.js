import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|card|code|input|kbd|link|listbox|modal|navbar|pagination|select|skeleton|snippet|toggle|table|ripple|spinner|divider|popover|scroll-shadow|checkbox|spacer).js"
  ],
  theme: {
    extend: { // Colors
      colors: {
        primary: "#00204D",
        secondary: "#0070B3"
      },
      fontSize: {
        "vw": "1vw",
        "2vw": "2vw",
        "3vw": "3vw",
        '4vw': '4vw',
        '5vw': '5vw',
        '6vw': '6vw',
        '7vw': '7vw',
      }
    },
  },
  darkMode: "class",
  plugins: [nextui(),
  require('@tailwindcss/aspect-ratio'),
  function ({ addBase, theme }) {
    addBase({
      ':root': {
        '--bg-primary': theme('colors.primary'),
        '--bg-secondary': theme('colors.secondary'),

        '--bg-blue-100': theme('colors.blue.100'),
        '--bg-blue-200': theme('colors.blue.200'),
        '--bg-blue-300': theme('colors.blue.300'),
        '--bg-blue-400': theme('colors.blue.400'),
        '--bg-blue-500': theme('colors.blue.500'),
        '--bg-blue-600': theme('colors.blue.600'),
        '--bg-blue-700': theme('colors.blue.700'),
        '--bg-blue-800': theme('colors.blue.800'),
        '--bg-blue-900': theme('colors.blue.900'),

        '--bg-green-100': theme('colors.green.100'),
        '--bg-green-200': theme('colors.green.200'),
        '--bg-green-300': theme('colors.green.300'),
        '--bg-green-400': theme('colors.green.400'),
        '--bg-green-500': theme('colors.green.500'),
        '--bg-green-600': theme('colors.green.600'),
        '--bg-green-700': theme('colors.green.700'),
        '--bg-green-800': theme('colors.green.800'),
        '--bg-green-900': theme('colors.green.900'),
      }
    })
  }],
}
