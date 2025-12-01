export interface PaymentLocationInput {
  lat: number
  lng: number
}

export interface PaymentSimulationInput {
  amount: number
  merchant_name: string
  merchant_category: string
  hour: number
  location?: PaymentLocationInput | null
}

export interface UserPatternSummary {
  avg_amount: number
  median_amount: number
  max_amount: number
  common_hours: number[]
  peak_hour: number | null
  common_categories: string[]
  trusted_merchants: string[]
  total_transactions: number
  learning_period_days: number
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export type TransactionAction = 'approved' | 'voice_verification' | 'blocked'

export interface RiskAnalysisResponse {
  transaction_id: string
  risk_score: number
  risk_level: RiskLevel
  risk_reasons: string[]
  action: TransactionAction
  risk_breakdown?: RiskBreakdown
}

export interface RiskBreakdown {
  amount: number
  time: number
  merchant: number
  location: number
}
