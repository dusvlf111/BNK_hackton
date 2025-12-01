// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { RiskResultCard } from '@/components/RiskResultCard'
import type { RiskAnalysisResponse } from '@/types/transaction.types'

describe('RiskResultCard', () => {
  it('shows a placeholder message before any simulation runs', () => {
    render(<RiskResultCard />)
    expect(screen.getByText(/결제 시뮬레이션을 시작/i)).toBeInTheDocument()
  })

  it('renders the risk details when a result is provided', () => {
    const mockResult: RiskAnalysisResponse = {
      transaction_id: 'txn_test',
      risk_score: 90,
      risk_level: 'critical',
      risk_reasons: ['평소보다 금액이 20배 이상 큽니다.'],
      action: 'blocked',
      risk_breakdown: { amount: 40, time: 35, merchant: 15, location: 0 },
    }

    render(<RiskResultCard result={mockResult} />)

    expect(screen.getByText(/90점/i)).toBeInTheDocument()
    expect(screen.getByText(/위험 요인/i)).toBeInTheDocument()
    expect(screen.getByText(mockResult.risk_reasons[0])).toBeInTheDocument()
    expect(screen.getByText(/즉시 차단되었습니다/i)).toBeInTheDocument()
  })
})
