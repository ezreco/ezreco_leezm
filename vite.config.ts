import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb, keep larger ones as separate files
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://43.200.32.71:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
