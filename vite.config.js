import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: {
    open: true,
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  root: '.',
  publicDir: 'public'
})