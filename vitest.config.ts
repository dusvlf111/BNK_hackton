import { defineConfig } from 'vitest/config'
import path from 'node:path'

const resolve = (...segments: string[]) => path.resolve(process.cwd(), ...segments)

export default defineConfig({
  resolve: {
    alias: {
      '@/app': resolve('app'),
      '@/components': resolve('components'),
      '@/lib': resolve('lib'),
      '@/hooks': resolve('hooks'),
      '@/store': resolve('store'),
      '@/types': resolve('types')
    }
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
})
