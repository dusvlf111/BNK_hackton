import { describe, it, expect } from 'vitest'
import {
  createAuthTestUser,
  missingSupabaseEnv,
  signInTestUser,
  supabaseTestEnabled,
} from './helpers'

if (!supabaseTestEnabled) {
  console.warn(
    `[supabase] Skipping auth tests because env vars are missing: ${missingSupabaseEnv.join(', ')}`,
  )
}

const suite = supabaseTestEnabled ? describe : describe.skip

suite('Supabase Auth', () => {
  it('supports email/password login and logout', async () => {
    const user = await createAuthTestUser('user')
    const { client, session } = await signInTestUser(user.email, user.password)

    expect(session?.user.email).toBe(user.email)

    const { error } = await client.auth.signOut()
    expect(error).toBeNull()
  })
})
