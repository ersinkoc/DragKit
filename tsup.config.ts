import { defineConfig } from 'tsup'

// Single config - builds sequentially to avoid race conditions
export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'plugins/index': 'src/plugins/index.ts',
    'react/index': 'src/adapters/react/index.ts',
    'vue/index': 'src/adapters/vue/index.ts',
    'svelte/index': 'src/adapters/svelte/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: false,
  sourcemap: true,
  outDir: 'dist',
  external: ['react', 'react-dom', 'vue', 'svelte', 'svelte/store'],
  platform: 'browser',
  target: 'es2020',
  esbuildOptions(options) {
    options.jsx = 'automatic'
    options.banner = {
      js: '/**\n * @oxog/dragkit v1.0.1\n * Zero-dependency drag & drop toolkit\n * MIT License\n */'
    }
  }
})
