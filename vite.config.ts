import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import eslint from 'vite-plugin-eslint'
import { visualizer } from 'rollup-plugin-visualizer'
import gzipPlugin from 'rollup-plugin-gzip'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    eslint(),
    gzipPlugin(),
    visualizer({ filename: 'dist/stats.html' }),
  ],
})
