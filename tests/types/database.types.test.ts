import { describe, it, expectTypeOf } from 'vitest'
import type { Database } from '@/types/database.types'

describe('Database types', () => {
  it('users table matches expected columns', () => {
    type UserRow = Database['public']['Tables']['users']['Row']
    expectTypeOf<UserRow>().toMatchTypeOf<{
      id: string
      email: string
      name: string | null
      phone: string | null
      role: string
      created_at: string
      updated_at: string
    }>()
  })

  it('transactions table enforces numeric amount and risk metadata', () => {
    type TransactionRow = Database['public']['Tables']['transactions']['Row']
    expectTypeOf<TransactionRow>().toMatchTypeOf<{
      id: string
      user_id: string
      amount: number
      merchant_name: string
      risk_score: number
      risk_reasons: TransactionRow['risk_reasons']
      voice_responses: TransactionRow['voice_responses']
    }>()
  })

  it('alerts relationships expose guardian linkage fields', () => {
    type AlertRow = Database['public']['Tables']['alerts']['Row']
    expectTypeOf<AlertRow>().toMatchTypeOf<{
      guardian_id: string | null
      transaction_id: string | null
      user_id: string
      payload: AlertRow['payload']
    }>()
  })
})
