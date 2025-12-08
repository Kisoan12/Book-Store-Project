/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#0EA5A3',
        accent2: '#7C3AED',
        card: '#0F1B2D',
        page: '#071023',
        text: '#E6EEF8',
        muted: '#9AA7BD',
        success: '#10B981',
        danger: '#EF4444',
      },
      borderRadius: {
        '2xl-lg': '12px'
      },
      boxShadow: {
        'card-md': '0 6px 18px rgba(2,6,23,0.6)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
      }
    },
  },
  plugins: [],
}
