import { describe, expect, it } from 'vitest'
import { calculateRiskScore, determineAction, getRiskLevel } from '@/lib/risk-scoring'
import type { PaymentSimulationInput, UserPatternSummary } from '@/types/transaction.types'

const basePattern: UserPatternSummary = {
  avg_amount: 50_000,
  median_amount: 45_000,
  max_amount: 500_000,
  common_hours: [10, 11, 12, 13, 14, 15],
  peak_hour: 13,
  common_categories: ['편의점', '식당/카페'],
  trusted_merchants: ['GS25 강남점', '스타벅스 강남점'],
  total_transactions: 42,
  learning_period_days: 30,
}

const normalTransaction: PaymentSimulationInput = {
  amount: 5_000,
  merchant_category: '편의점',
  merchant_name: 'GS25 강남점',
  hour: 13,
}

const riskyTransaction: PaymentSimulationInput = {
  amount: 3_000_000,
  merchant_category: '온라인쇼핑',
  merchant_name: '무신사 스토어',
  hour: 2,
}

describe('risk scoring', () => {
  it('keeps low-risk scenarios under the low threshold with no reasons', () => {
    const { score, reasons, breakdown } = calculateRiskScore(normalTransaction, basePattern)
    expect(score).toBe(0)
    expect(breakdown.amount).toBe(0)
    expect(reasons).toHaveLength(0)
    expect(getRiskLevel(score)).toBe('low')
    expect(determineAction('low')).toBe('approved')
  })

  it('flags high-risk scenarios with the correct level and action', () => {
    const { score, reasons } = calculateRiskScore(riskyTransaction, basePattern)
    expect(score).toBeGreaterThanOrEqual(80)
    expect(getRiskLevel(score)).toBe('critical')
    expect(determineAction('critical')).toBe('blocked')
    expect(reasons).toEqual(
      expect.arrayContaining([
        expect.stringContaining('금액이 20배 이상'),
        '새벽(0-5시) 시간대 결제입니다.',
        '평소에 이용하지 않는 업종입니다.',
        '처음 이용하는 가맹점입니다.',
      ]),
    )
  })

  it('adds time reason when outside common hours even if not night', () => {
    const { reasons, breakdown } = calculateRiskScore(
      { ...normalTransaction, hour: 8 },
      basePattern,
    )
    expect(breakdown.time).toBe(15)
    expect(reasons).toContain('평소 이용하지 않는 시간대입니다.')
  })
})
