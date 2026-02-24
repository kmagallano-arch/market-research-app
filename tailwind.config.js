/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        navy: '#0B1426', navy2: '#111E35', navy3: '#162040',
        card: '#152035', border: '#1E2E4A',
        accent: '#2E6FFF', us: '#2E6FFF', ph: '#FF4D6A',
        success: '#00C48C', amber: '#FFB830', purple: '#8B5CF6',
      },
    },
  },
  plugins: [],
}
