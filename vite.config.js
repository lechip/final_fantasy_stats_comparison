import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages project sites serve the app from /<repo>/.
// In CI we derive the repo name from GITHUB_REPOSITORY; locally we stay at '/'.
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repo ? `/${repo}/` : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [vue()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: false,
  },
})
