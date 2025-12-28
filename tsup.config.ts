import { defineConfig } from 'tsup'

export default defineConfig([
  // Core package
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    treeshake: true,
    splitting: false,
    sourcemap: true,
    outDir: 'dist',
    external: [],
    noExternal: [],
    platform: 'browser',
    target: 'es2020',
    esbuildOptions(options) {
      options.banner = {
        js: '/**\n * @oxog/dragkit v1.0.0\n * Zero-dependency drag & drop toolkit\n * MIT License\n */'
      }
    }
  },
  // Plugins
  {
    entry: ['src/plugins/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    treeshake: true,
    sourcemap: true,
    outDir: 'dist/plugins',
    external: [],
    platform: 'browser',
    target: 'es2020'
  },
  // React adapter
  {
    entry: ['src/adapters/react/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    treeshake: true,
    sourcemap: true,
    outDir: 'dist/react',
    external: ['react', 'react-dom'],
    platform: 'browser',
    target: 'es2020',
    esbuildOptions(options) {
      options.jsx = 'automatic'
    }
  },
  // Vue adapter
  {
    entry: ['src/adapters/vue/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    treeshake: true,
    sourcemap: true,
    outDir: 'dist/vue',
    external: ['vue'],
    platform: 'browser',
    target: 'es2020'
  },
  // Svelte adapter
  {
    entry: ['src/adapters/svelte/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    treeshake: true,
    sourcemap: true,
    outDir: 'dist/svelte',
    external: ['svelte', 'svelte/store'],
    platform: 'browser',
    target: 'es2020'
  }
])
