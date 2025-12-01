import { calculateRiskScore, determineAction, getRiskLevel } from '@/lib/risk-scoring'
import type {
  PaymentSimulationInput,
  RiskAnalysisResponse,
  RiskLevel,
  TransactionAction,
  UserPatternSummary,
} from '@/types/transaction.types'

export interface SimulationContext {
  input: PaymentSimulationInput
  userId: string
}

export interface InsertTransactionInput {
  userId: string
  amount: number
  merchant_name: string
  merchant_category: string
  risk_score: number
  risk_level: RiskLevel
  risk_reasons: string[]
  action: TransactionAction
}

export interface SimulationDependencies {
  getUserPattern: (userId: string) => Promise<UserPatternSummary>
  insertTransaction: (payload: InsertTransactionInput) => Promise<{ id: string }>
}

export async function processSimulationRequest(
  context: SimulationContext,
  deps: SimulationDependencies,
): Promise<RiskAnalysisResponse> {
  const userPattern = await deps.getUserPattern(context.userId)
  const risk = calculateRiskScore(context.input, userPattern)
  const riskLevel = getRiskLevel(risk.score)
  const action = determineAction(riskLevel)

  const { id } = await deps.insertTransaction({
    userId: context.userId,
    amount: context.input.amount,
    merchant_name: context.input.merchant_name,
    merchant_category: context.input.merchant_category,
    risk_score: risk.score,
    risk_level: riskLevel,
    risk_reasons: risk.reasons,
    action,
  })

  return {
    transaction_id: id,
    risk_score: risk.score,
    risk_level: riskLevel,
    risk_reasons: risk.reasons,
    action,
    risk_breakdown: risk.breakdown,
  }
}
