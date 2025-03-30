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
    }
  }
})
