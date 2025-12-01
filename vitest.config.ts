import { defineConfig } from 'vitest/config'
import path from 'node:path'
import { config as loadEnv } from 'dotenv'
import fs from 'node:fs'

const envFile = ['.env.test', '.env.local', '.env'].find((file) => fs.existsSync(path.resolve(process.cwd(), file)))

if (envFile) {
  loadEnv({ path: envFile })
}

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
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx']
  }
})
