import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@emotion/styled': path.resolve('./node_modules/@emotion/styled'),
      '@emotion/react': path.resolve('./node_modules/@emotion/react'),
      '@mui/material': path.resolve('./node_modules/@mui/material'),
      '@mui/x-data-grid': path.resolve('./node_modules/@mui/x-data-grid'),
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled', '@mui/x-data-grid'],
        }
      }
    }
  }
})
