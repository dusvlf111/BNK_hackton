import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key])

const runTest = missingEnvVars.length === 0 ? it : it.skip

if (missingEnvVars.length > 0) {
  console.warn(
    `[supabase] Skipping schema tests because env vars are missing: ${missingEnvVars.join(', ')}`,
  )
}

const supabase =
  missingEnvVars.length === 0
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        auth: { persistSession: false },
      })
    : null

async function expectTableReadable(table: string) {
  if (!supabase) return
  const { error } = await supabase.from(table).select('*', { head: true, count: 'exact' })
  expect(error).toBeNull()
}

describe('Database core tables', () => {
  const tables = ['users', 'transactions', 'voice_calls', 'guardians', 'alerts']

  tables.forEach((table) => {
    runTest(`${table} table exists`, async () => {
      await expectTableReadable(table)
    })
  })
})
