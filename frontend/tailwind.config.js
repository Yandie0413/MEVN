/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'edu-bg': '#F4F5F9',
        'edu-navy': '#1E1F24',
        'edu-lime': '#D4F063',
        'edu-text-main': '#0F172A',
        'edu-text-muted': '#64748B',
        // Pastel colors for badges/icons
        'edu-rose': '#FEE2E2',
        'edu-lavender': '#E0E7FF',
        'edu-sky': '#E0F2FE',
        'edu-orange': '#FFEDD5',
        'edu-green': '#DCFCE7'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
