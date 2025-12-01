import { describe, it, expect } from 'vitest'
import { checkSupabaseHealth } from '@/lib/supabase/health-check'

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
]

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key])

const testOrSkip = missingEnvVars.length === 0 ? it : it.skip

if (missingEnvVars.length > 0) {
  console.warn(
    `[supabase] Skipping connection test because env vars are missing: ${missingEnvVars.join(', ')}`,
  )
}

describe('Supabase connection', () => {
  testOrSkip('responds to health check endpoint', async () => {
    const result = await checkSupabaseHealth()
    expect(result.ok).toBe(true)
    expect(result.status).toBe(200)
  })
})
