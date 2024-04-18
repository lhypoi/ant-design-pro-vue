/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx,vue}'],
  mode: 'jit',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Alibaba PuHuiTi 2.0 55 Regular"', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        blue: {
          400: 'rgba(24, 144, 255, 1)'
        }
      }
    }
  }
}
