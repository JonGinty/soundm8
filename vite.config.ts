import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true, // Automatically open the visualization in the browser
    }),
  ],
  base: '/soundm8/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@mantine/core'],
          vexflow: ['vexflow'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the limit as needed
  },
})
