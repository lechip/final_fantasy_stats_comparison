import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.js'],
    // Each test file gets a fresh module registry, so the module-scoped
    // store singleton (useComparison) starts clean per file.
    restoreMocks: true,
  },
})
