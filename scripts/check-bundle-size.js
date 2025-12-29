/**
 * Bundle Size Check Script
 * Verifies that bundle sizes are within limits
 */

import { readFileSync } from 'fs'
import { gzipSync } from 'zlib'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const files = [
  { name: 'Core', path: join(rootDir, 'dist/index.js'), limit: 5 * 1024 },
  { name: 'Plugins', path: join(rootDir, 'dist/plugins/index.js'), limit: 10 * 1024 },
  { name: 'React Adapter', path: join(rootDir, 'dist/react/index.js'), limit: 8 * 1024 },
  { name: 'Vue Adapter', path: join(rootDir, 'dist/vue/index.js'), limit: 6 * 1024 },
  { name: 'Svelte Adapter', path: join(rootDir, 'dist/svelte/index.js'), limit: 6 * 1024 }
]

console.log('\n📦 Bundle Size Report\n')
console.log('─'.repeat(60))

let hasError = false

files.forEach(({ name, path, limit }) => {
  try {
    const content = readFileSync(path)
    const gzipped = gzipSync(content)
    const size = gzipped.length
    const sizeKB = (size / 1024).toFixed(2)
    const limitKB = (limit / 1024).toFixed(0)
    const percentage = ((size / limit) * 100).toFixed(1)

    const status = size <= limit ? '✅' : '❌'
    const color = size <= limit ? '\x1b[32m' : '\x1b[31m'
    const reset = '\x1b[0m'

    console.log(
      `${status} ${name.padEnd(20)} ${color}${sizeKB.padStart(8)} KB${reset} / ${limitKB} KB (${percentage}%)`
    )

    if (size > limit) {
      hasError = true
      console.log(`   ⚠️  Exceeds limit by ${((size - limit) / 1024).toFixed(2)} KB`)
    }
  } catch (error) {
    console.log(`⚠️  ${name.padEnd(20)} File not found: ${path}`)
  }
})

console.log('─'.repeat(60))

if (hasError) {
  console.error('\n❌ Bundle size check failed!\n')
  process.exit(1)
} else {
  console.log('\n✅ All bundle sizes are within limits!\n')
  process.exit(0)
}
