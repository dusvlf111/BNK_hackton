import { describe, expect, it, vi } from 'vitest'
import { processSimulationRequest } from '@/lib/transactions/simulator'
import type { PaymentSimulationInput, UserPatternSummary } from '@/types/transaction.types'

const mockPattern: UserPatternSummary = {
  avg_amount: 60_000,
  median_amount: 50_000,
  max_amount: 600_000,
  common_hours: [12, 13, 14],
  peak_hour: 13,
  common_categories: ['편의점', '식당/카페'],
  trusted_merchants: ['GS25 강남점'],
  total_transactions: 24,
  learning_period_days: 30,
}

const baseInput: PaymentSimulationInput = {
  amount: 3_000_000,
  merchant_category: '온라인쇼핑',
  merchant_name: '무신사 스토어',
  hour: 2,
}

describe('processSimulationRequest', () => {
  it('computes risk, determines action, and persists the transaction', async () => {
    const insertTransaction = vi.fn(async () => ({ id: 'txn_test' }))
    const getUserPattern = vi.fn(async () => mockPattern)

    const result = await processSimulationRequest(
      { input: baseInput, userId: 'user-123' },
      { getUserPattern, insertTransaction },
    )

    expect(getUserPattern).toHaveBeenCalledWith('user-123')
    expect(insertTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-123',
        amount: baseInput.amount,
        merchant_category: baseInput.merchant_category,
      }),
    )

    expect(result.transaction_id).toBe('txn_test')
    expect(result.risk_level).toBe('critical')
    expect(result.action).toBe('blocked')
    expect(result.risk_reasons.length).toBeGreaterThan(0)
    expect(result.risk_breakdown?.amount).toBeGreaterThan(0)
  })
})
