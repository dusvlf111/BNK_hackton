import type {
  PaymentSimulationInput,
  RiskBreakdown,
  RiskLevel,
  TransactionAction,
  UserPatternSummary,
} from '@/types/transaction.types'

export interface RiskScoreResult {
  score: number
  breakdown: RiskBreakdown
  reasons: string[]
}

const DEFAULT_AVG_AMOUNT = 50_000
const MAX_LOCATION_RISK = 0 // placeholder until geolocation is implemented

const amountThresholds = [
  { ratio: 20, score: 40, reason: '평소보다 금액이 20배 이상 큽니다.' },
  { ratio: 10, score: 30, reason: '평소보다 금액이 10배 이상 큽니다.' },
  { ratio: 5, score: 20, reason: '평소보다 금액이 5배 이상 큽니다.' },
  { ratio: 3, score: 10, reason: '평소보다 금액이 3배 이상 큽니다.' },
] as const

interface RiskReasonContext {
  amountReason?: string
  isCommonHour: boolean
  isNightHour: boolean
  uncommonCategory: boolean
  untrustedMerchant: boolean
}

export function calculateRiskScore(transaction: PaymentSimulationInput, userPattern: UserPatternSummary): RiskScoreResult {
  const baselineAmount = userPattern.avg_amount ?? 0
  const safeBaseline = baselineAmount > 0 ? baselineAmount : DEFAULT_AVG_AMOUNT
  const amountRatio = transaction.amount / safeBaseline

  const amountEvaluation = evaluateAmountRisk(amountRatio)

  const isCommonHour = userPattern.common_hours.includes(transaction.hour)
  const isNightHour = transaction.hour >= 0 && transaction.hour < 6

  const timeRisk = (isCommonHour ? 0 : 15) + (isNightHour ? 20 : 0)

  const uncommonCategory = !userPattern.common_categories.includes(transaction.merchant_category)
  const untrustedMerchant = !userPattern.trusted_merchants.includes(transaction.merchant_name)
  const merchantRisk = (uncommonCategory ? 8 : 0) + (untrustedMerchant ? 7 : 0)

  const breakdown: RiskBreakdown = {
    amount: amountEvaluation.score,
    time: timeRisk,
    merchant: merchantRisk,
    location: MAX_LOCATION_RISK,
  }

  const totalScore = Math.min(breakdown.amount + breakdown.time + breakdown.merchant + breakdown.location, 100)

  const reasons = buildRiskReasons({
    amountReason: amountEvaluation.reason,
    isCommonHour,
    isNightHour,
    uncommonCategory,
    untrustedMerchant,
  })

  return { score: totalScore, breakdown, reasons }
}

function evaluateAmountRisk(ratio: number) {
  for (const threshold of amountThresholds) {
    if (ratio > threshold.ratio) {
      return { score: threshold.score, reason: threshold.reason }
    }
  }
  return { score: 0, reason: undefined }
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 81) return 'critical'
  if (score >= 61) return 'high'
  if (score >= 31) return 'medium'
  return 'low'
}

export function buildRiskReasons(context: RiskReasonContext) {
  const reasons: string[] = []

  if (context.amountReason) {
    reasons.push(context.amountReason)
  }

  if (!context.isCommonHour) {
    reasons.push('평소 이용하지 않는 시간대입니다.')
  }

  if (context.isNightHour) {
    reasons.push('새벽(0-5시) 시간대 결제입니다.')
  }

  if (context.uncommonCategory) {
    reasons.push('평소에 이용하지 않는 업종입니다.')
  }

  if (context.untrustedMerchant) {
    reasons.push('처음 이용하는 가맹점입니다.')
  }

  return reasons
}

export function determineAction(level: RiskLevel): TransactionAction {
  if (level === 'critical') return 'blocked'
  if (level === 'high' || level === 'medium') return 'voice_verification'
  return 'approved'
}
