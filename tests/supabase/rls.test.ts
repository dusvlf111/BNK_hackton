import { describe, it, expect } from 'vitest'
import {
  createAuthTestUser,
  missingSupabaseEnv,
  serviceClient,
  signInTestUser,
  supabaseTestEnabled,
} from './helpers'

if (!supabaseTestEnabled) {
  console.warn(
    `[supabase] Skipping RLS tests because env vars are missing: ${missingSupabaseEnv.join(', ')}`,
  )
}

const suite = supabaseTestEnabled ? describe : describe.skip

suite('RLS policies', () => {
  it('allows users to read their own profile only', async () => {
    const alice = await createAuthTestUser('user')
    const bob = await createAuthTestUser('user')

    const { client: aliceClient } = await signInTestUser(alice.email, alice.password)

    const { data: ownProfile, error: ownError } = await aliceClient
      .from('users')
      .select('id')
      .eq('id', alice.id)
      .maybeSingle()

    expect(ownError).toBeNull()
    expect(ownProfile?.id).toBe(alice.id)

    const { data: otherProfile, error: otherError } = await aliceClient
      .from('users')
      .select('id')
      .eq('id', bob.id)
      .maybeSingle()

    expect(otherError).toBeNull()
    expect(otherProfile).toBeNull()
  })

  it('allows accepted guardians to read linked transactions', async () => {
    if (!serviceClient) throw new Error('service client unavailable')

    const senior = await createAuthTestUser('user')
    const guardian = await createAuthTestUser('guardian')
    const stranger = await createAuthTestUser('user')

    await serviceClient
      .from('guardians')
      .insert({ user_id: senior.id, guardian_id: guardian.id, status: 'accepted' })

    const { data: transaction, error: txError } = await serviceClient
      .from('transactions')
      .insert({
        user_id: senior.id,
        amount: 150000,
        merchant_name: 'High Risk Merchant',
        merchant_category: '기타',
        risk_score: 90,
        risk_level: 'critical',
        status: 'requires_review',
      })
      .select('id, user_id')
      .single()

    if (txError) throw txError

    const { client: guardianClient } = await signInTestUser(guardian.email, guardian.password)
    const { data: guardianView } = await guardianClient
      .from('transactions')
      .select('id, user_id')
      .eq('id', transaction.id)
      .maybeSingle()

    expect(guardianView?.user_id).toBe(senior.id)

    const { client: strangerClient } = await signInTestUser(stranger.email, stranger.password)
    const { data: strangerView } = await strangerClient
      .from('transactions')
      .select('id')
      .eq('id', transaction.id)
      .maybeSingle()

    expect(strangerView).toBeNull()
  })

  it('restricts alerts to owners and assigned guardians', async () => {
    if (!serviceClient) throw new Error('service client unavailable')

    const senior = await createAuthTestUser('user')
    const guardian = await createAuthTestUser('guardian')
    const stranger = await createAuthTestUser('user')

    await serviceClient
      .from('guardians')
      .insert({ user_id: senior.id, guardian_id: guardian.id, status: 'accepted' })

    const { data: alert, error: alertError } = await serviceClient
      .from('alerts')
      .insert({
        user_id: senior.id,
        guardian_id: guardian.id,
        type: 'risk',
        severity: 'high',
        message: 'Potential fraud detected',
      })
      .select('id, user_id, guardian_id')
      .single()

    if (alertError) throw alertError

    const { client: seniorClient } = await signInTestUser(senior.email, senior.password)
    const { data: seniorView } = await seniorClient
      .from('alerts')
      .select('id')
      .eq('id', alert.id)
      .maybeSingle()

    expect(seniorView?.id).toBe(alert.id)

    const { client: guardianClient } = await signInTestUser(guardian.email, guardian.password)
    const { data: guardianView } = await guardianClient
      .from('alerts')
      .select('id')
      .eq('id', alert.id)
      .maybeSingle()

    expect(guardianView?.id).toBe(alert.id)

    const { client: strangerClient } = await signInTestUser(stranger.email, stranger.password)
    const { data: strangerView } = await strangerClient
      .from('alerts')
      .select('id')
      .eq('id', alert.id)
      .maybeSingle()

    expect(strangerView).toBeNull()
  })
})
