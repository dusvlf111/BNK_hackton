import { describe, expect, it } from 'vitest'
import {
  MERCHANT_CATEGORIES,
  QUICK_SCENARIOS,
  getQuickScenarioValues,
  paymentSimulatorSchema,
} from '@/lib/payment-simulator'

const validPayload = {
  amount: 5000,
  merchant_name: 'GS25 강남점',
  merchant_category: MERCHANT_CATEGORIES[0],
  hour: 13,
}

describe('paymentSimulatorSchema', () => {
  it('accepts a valid payload', () => {
    const result = paymentSimulatorSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejects amounts below the minimum', () => {
    const result = paymentSimulatorSchema.safeParse({ ...validPayload, amount: 999 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.amount?.[0]).toContain('1,000')
    }
  })

  it('rejects empty merchant names', () => {
    const result = paymentSimulatorSchema.safeParse({ ...validPayload, merchant_name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.merchant_name?.[0]).toBe('가맹점명을 입력하세요.')
    }
  })

  it('rejects invalid merchant categories', () => {
    const result = paymentSimulatorSchema.safeParse({ ...validPayload, merchant_category: 'INVALID' as never })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.merchant_category?.[0]).toBe('가맹점 업종을 선택하세요.')
    }
  })

  it('rejects hours outside of 0-23', () => {
    const result = paymentSimulatorSchema.safeParse({ ...validPayload, hour: 24 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.hour?.[0]).toContain('0-23')
    }
  })
})

describe('quick scenario presets', () => {
  it('exposes the expected three presets', () => {
    expect(QUICK_SCENARIOS).toHaveLength(3)
    expect(QUICK_SCENARIOS.map((scenario) => scenario.id)).toContain('normal')
    expect(QUICK_SCENARIOS.map((scenario) => scenario.id)).toContain('high')
    expect(QUICK_SCENARIOS.map((scenario) => scenario.id)).toContain('night')
  })

  it('provides schema-valid values for each preset', () => {
    QUICK_SCENARIOS.forEach((scenario) => {
      const result = paymentSimulatorSchema.safeParse(scenario.values)
      expect(result.success).toBe(true)
    })
  })

  it('returns undefined for unknown presets', () => {
    expect(getQuickScenarioValues('unknown')).toBeUndefined()
  })
})
