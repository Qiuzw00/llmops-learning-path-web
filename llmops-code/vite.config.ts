import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/llmops-learning-path-web/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../',
    emptyOutDir: false,
  },
})
