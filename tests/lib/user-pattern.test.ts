import { describe, expect, it } from 'vitest'
import {
  DEFAULT_USER_PATTERN,
  buildUserPatternFromTransactions,
  getUserPattern,
  type PatternTransactionSample,
} from '@/lib/user-pattern'

const mockTransactions: PatternTransactionSample[] = [
  { amount: 30_000, created_at: '2024-11-01T10:00:00Z', merchant_category: '편의점', merchant_name: 'GS25 강남점' },
  { amount: 45_000, created_at: '2024-11-02T11:00:00Z', merchant_category: '편의점', merchant_name: 'CU 강남점' },
  { amount: 55_000, created_at: '2024-11-03T12:00:00Z', merchant_category: '식당/카페', merchant_name: '스타벅스 강남점' },
  { amount: 80_000, created_at: '2024-11-04T12:30:00Z', merchant_category: '식당/카페', merchant_name: '스타벅스 강남점' },
  { amount: 150_000, created_at: '2024-11-05T13:00:00Z', merchant_category: '교통/모빌리티', merchant_name: 'KTX' },
  { amount: 60_000, created_at: '2024-11-06T10:30:00Z', merchant_category: '식당/카페', merchant_name: '스타벅스 강남점' },
]

describe('user pattern builder', () => {
  it('calculates averages and frequent categories', () => {
    const pattern = buildUserPatternFromTransactions(mockTransactions)
    expect(pattern.avg_amount).toBeGreaterThan(50_000)
    expect(pattern.max_amount).toBe(150_000)
    expect(pattern.common_hours.length).toBeGreaterThan(0)
    expect(pattern.common_categories).toContain('식당/카페')
    expect(pattern.trusted_merchants[0]).toBe('스타벅스 강남점')
    expect(pattern.total_transactions).toBe(mockTransactions.length)
  })
})

describe('getUserPattern', () => {
  it('returns default when data is insufficient', async () => {
    const pattern = await getUserPattern('user-1', {
      fetchTransactions: async () => mockTransactions.slice(0, 2),
    })
    expect(pattern).toEqual(DEFAULT_USER_PATTERN)
  })

  it('uses computed stats when enough data is present', async () => {
    const pattern = await getUserPattern('user-1', {
      fetchTransactions: async () => mockTransactions,
    })
    expect(pattern.avg_amount).toBeGreaterThan(40_000)
    expect(pattern.common_categories.length).toBeGreaterThan(0)
    expect(pattern.total_transactions).toBe(mockTransactions.length)
  })
})
