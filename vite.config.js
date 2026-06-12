import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Base path:
//   Netlify (default) → '/'
//   GitHub Pages      → set VITE_BASE_PATH=/easy-font-tamil/ in the CI environment
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})

