import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseAdminClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'
import type { UserPatternSummary } from '@/types/transaction.types'

export type PatternTransactionSample = Pick<Database['public']['Tables']['transactions']['Row'], 'amount' | 'created_at' | 'merchant_category' | 'merchant_name'>

export const DEFAULT_USER_PATTERN: UserPatternSummary = {
  avg_amount: 50_000,
  median_amount: 50_000,
  max_amount: 200_000,
  common_hours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  peak_hour: 12,
  common_categories: [],
  trusted_merchants: [],
  total_transactions: 0,
  learning_period_days: 30,
}

interface GetUserPatternOptions {
  client?: SupabaseClient<Database>
  fetchTransactions?: () => Promise<PatternTransactionSample[]>
}

export async function getUserPattern(userId: string, options: GetUserPatternOptions = {}): Promise<UserPatternSummary> {
  const fetchTransactions = options.fetchTransactions ?? (async () => fetchRecentTransactions(userId, options.client))
  const transactions = await fetchTransactions()

  if (!transactions || transactions.length < 5) {
    return DEFAULT_USER_PATTERN
  }

  return buildUserPatternFromTransactions(transactions)
}

async function fetchRecentTransactions(userId: string, client?: SupabaseClient<Database>) {
  const supabase = client ?? createSupabaseAdminClient()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, created_at, merchant_category, merchant_name')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    throw new Error(`Failed to fetch user pattern transactions: ${error.message}`)
  }

  return data ?? []
}

export function buildUserPatternFromTransactions(transactions: PatternTransactionSample[]): UserPatternSummary {
  const amounts = transactions.map((t) => t.amount)
  const hours = transactions.map((t) => new Date(t.created_at).getHours())
  const categories = transactions.map((t) => t.merchant_category)
  const merchants = transactions.map((t) => t.merchant_name)

  const avg_amount = Math.round(mean(amounts))
  const median_amount = Math.round(median(amounts))
  const max_amount = Math.max(...amounts)

  const common_hours = getFrequentValues(hours, 0.2)
  const peak_hour = hours.length ? getTopValues(hours, 1)[0] ?? null : null
  const fallbackHours = peak_hour !== undefined && peak_hour !== null ? [peak_hour] : []
  const normalizedHours = common_hours.length > 0 ? common_hours : fallbackHours.length > 0 ? fallbackHours : DEFAULT_USER_PATTERN.common_hours

  return {
    avg_amount,
    median_amount,
    max_amount,
    common_hours: normalizedHours,
    peak_hour: peak_hour ?? null,
    common_categories: getTopValues(categories, 3),
    trusted_merchants: getTopValues(merchants, 5),
    total_transactions: transactions.length,
    learning_period_days: 30,
  }
}

function mean(values: number[]) {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function median(values: number[]) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

function getFrequentValues(values: number[], minRatio: number) {
  const counts = buildFrequencyMap(values)
  const threshold = Math.ceil(values.length * minRatio)
  const frequent = Object.entries(counts)
    .filter(([, count]) => count >= threshold)
    .map(([value]) => Number(value))
    .sort((a, b) => a - b)
  return frequent
}

function getTopValues<T extends string | number>(values: T[], limit: number): T[] {
  if (values.length === 0) return []
  const counts = buildFrequencyMap(values)
  const isNumber = typeof values[0] === 'number'

  return Object.entries(counts)
    .sort((a, b) => {
      const countDiff = b[1] - a[1]
      if (countDiff !== 0) return countDiff
      if (isNumber) {
        return Number(a[0]) - Number(b[0])
      }
      return String(a[0]).localeCompare(String(b[0]))
    })
    .slice(0, limit)
    .map(([value]) => (isNumber ? (Number(value) as T) : (value as T)))
}

function buildFrequencyMap<T extends string | number>(values: T[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    const key = String(value)
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})
}
