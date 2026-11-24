/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: { 950: '#05030a', 900: '#0a0614', 800: '#120a22', 700: '#1b0f33' },
        violet: { deep: '#2a0b4a', royal: '#4b1381', glow: '#8b3dff' },
        magenta: { DEFAULT: '#c21d8f', bright: '#e0249c' },
        pink: { electric: '#ff3ea5' },
        neon: { cyan: '#4fe3ff' },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        sans: ['"Manrope Variable"', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(224, 36, 156, 0.55)',
        'glow-violet': '0 0 60px -10px rgba(139, 61, 255, 0.55)',
        device: '0 50px 100px -30px rgba(0,0,0,0.85), 0 30px 60px -30px rgba(139, 61, 255, 0.45)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(100deg, #8b3dff 0%, #c21d8f 55%, #ff3ea5 100%)',
      },
    },
  },
  plugins: [],
};
