// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePaymentSimulation } from '@/hooks/usePaymentSimulation'
import type { PaymentSimulationInput, RiskAnalysisResponse } from '@/types/transaction.types'

const baseInput: PaymentSimulationInput = {
  amount: 5_000,
  merchant_category: '편의점',
  merchant_name: 'GS25 강남점',
  hour: 13,
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePaymentSimulation', () => {
  it('stores the API result when the request succeeds', async () => {
    const mockResponse: RiskAnalysisResponse = {
      transaction_id: 'txn_123',
      risk_score: 15,
      risk_level: 'low',
      risk_reasons: [],
      action: 'approved',
      risk_breakdown: { amount: 0, time: 0, merchant: 0, location: 0 },
    }

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const { result } = renderHook(() => usePaymentSimulation())

    await act(async () => {
      await result.current.simulate(baseInput)
    })

    expect(result.current.result).toEqual(mockResponse)
    expect(result.current.error).toBeNull()
    expect(result.current.isSubmitting).toBe(false)
  })

  it('captures the error message when the request fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Unauthorized' }),
    } as Response)

    const { result } = renderHook(() => usePaymentSimulation())

    await act(async () => {
      await result.current.simulate(baseInput)
    })

    expect(result.current.result).toBeNull()
    expect(result.current.error).toBe('Unauthorized')
  })
})
