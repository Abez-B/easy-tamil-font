/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // All themed colors point to CSS variables so dark mode works.
        // When .dark is on <html>, the vars update and every Tailwind
        // utility that uses these colors updates with them.
        'bg':             'var(--color-bg)',
        'bg-secondary':   'var(--color-bg-secondary)',
        'border':         'var(--color-border)',
        'text':           'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        'primary':        'var(--color-primary)',
        'accent':         'var(--color-accent)',
        'accent-hover':   'var(--color-accent-hover)',
      },
      fontFamily: {
        'sans': ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        'tamil': ['var(--font-tamil)', 'system-ui', 'sans-serif'],
        'heading': ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
