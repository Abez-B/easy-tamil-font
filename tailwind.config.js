/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Minimal monochrome palette
        'bg': '#ffffff',
        'bg-secondary': '#f8f9fa',
        'border': '#e9ecef',
        'text': '#212529',
        'text-secondary': '#6c757d',
        'primary': '#343a40',
        'accent': '#495057',
        'hover': '#dee2e6',
      },
      fontFamily: {
        'tamil': ['var(--font-tamil)', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
