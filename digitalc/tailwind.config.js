/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald Green
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#3B82F6', // Royal Blue
          dark: '#2563EB',
        },
        accent: '#F59E0B', // Amber
        background: {
          light: '#F9FAFB', // Cool Gray 50
          dark: '#111827', // Gray 900
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
