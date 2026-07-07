import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
// Base path:
//   Cloudflare/Default → '/'
//   GitHub Pages      → set VITE_BASE_PATH=/ezhuthurukal/ in the CI environment
export default defineConfig({
  plugins: [react(), cloudflare()],
  base: process.env.VITE_BASE_PATH || '/',
})