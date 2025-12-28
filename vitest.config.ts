import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      all: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.spec.ts',
        'src/**/*.spec.tsx',
        'src/**/index.ts',
        'src/types.ts'
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@oxog/dragkit': path.resolve(__dirname, './src/index.ts'),
      '@oxog/dragkit/plugins': path.resolve(__dirname, './src/plugins/index.ts'),
      '@oxog/dragkit/react': path.resolve(__dirname, './src/adapters/react/index.ts'),
      '@oxog/dragkit/vue': path.resolve(__dirname, './src/adapters/vue/index.ts'),
      '@oxog/dragkit/svelte': path.resolve(__dirname, './src/adapters/svelte/index.ts')
    }
  }
})
