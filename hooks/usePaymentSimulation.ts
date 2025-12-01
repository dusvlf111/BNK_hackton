'use client'

import { useCallback, useState } from 'react'
import type { PaymentSimulationInput, RiskAnalysisResponse } from '@/types/transaction.types'

export function usePaymentSimulation() {
  const [result, setResult] = useState<RiskAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const simulate = useCallback(async (values: PaymentSimulationInput) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/transactions/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        let message = '시뮬레이션 요청에 실패했습니다.'
        try {
          const errorBody = await response.json()
          if (typeof errorBody?.error === 'string') {
            message = errorBody.error
          }
        } catch {
          // swallow
        }
        setError(message)
        return
      }

      const data = (await response.json()) as RiskAnalysisResponse
      setResult(data)
    } catch (simulationError) {
      console.error('[usePaymentSimulation] request failed', simulationError)
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도하세요.')
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { result, error, isSubmitting, simulate }
}
