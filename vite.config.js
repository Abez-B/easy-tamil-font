import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Required for GitHub Pages deployment at /<repo-name>/
  // Change this to '/' if deploying to a custom domain root
  base: '/easy-font-tamil/',
})
