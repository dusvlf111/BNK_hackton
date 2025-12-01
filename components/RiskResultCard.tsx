'use client'

import React, { type ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, PhoneCall, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/components/lib/utils'
import type { RiskAnalysisResponse, RiskLevel } from '@/types/transaction.types'

interface RiskResultCardProps {
  result?: RiskAnalysisResponse | null
  isLoading?: boolean
  error?: string | null
}

const levelMeta: Record<
  RiskLevel,
  {
    label: string
    color: string
    bar: string
    icon: ReactNode
    message: string
  }
> = {
  low: {
    label: '낮음',
    color: 'text-green-600',
    bar: 'bg-green-500',
    icon: <CheckCircle2 className="h-6 w-6 text-green-500" aria-hidden="true" />,
    message: '안전하게 승인되었습니다.',
  },
  medium: {
    label: '보통',
    color: 'text-amber-600',
    bar: 'bg-amber-500',
    icon: <PhoneCall className="h-6 w-6 text-amber-500" aria-hidden="true" />,
    message: '음성 확인 전화가 발신됩니다.',
  },
  high: {
    label: '높음',
    color: 'text-orange-600',
    bar: 'bg-orange-500',
    icon: <AlertTriangle className="h-6 w-6 text-orange-500" aria-hidden="true" />,
    message: '음성 확인 전화가 발신됩니다.',
  },
  critical: {
    label: '매우 높음',
    color: 'text-red-600',
    bar: 'bg-red-500',
    icon: <ShieldAlert className="h-6 w-6 text-red-500" aria-hidden="true" />,
    message: '즉시 차단되었습니다.',
  },
}

export function RiskResultCard({ result, isLoading, error }: RiskResultCardProps) {
  let content: ReactNode = null

  if (isLoading) {
    content = (
      <div className="space-y-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-10 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-24 animate-pulse rounded bg-muted" />
      </div>
    )
  } else if (error) {
    content = <p className="text-sm text-red-600">{error}</p>
  } else if (!result) {
    content = <p className="text-sm text-muted-foreground">결제 시뮬레이션을 시작하면 결과가 여기에 표시됩니다.</p>
  } else {
    const meta = levelMeta[result.risk_level]
    const breakdown = result.risk_breakdown ?? { amount: 0, time: 0, merchant: 0, location: 0 }
    const maxScore = 100
    const scorePercent = Math.min(result.risk_score, maxScore)

    content = (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          {meta.icon}
          <div>
            <p className="text-sm text-muted-foreground">위험도</p>
            <p className={cn('text-2xl font-semibold', meta.color)}>
              {result.risk_score}점 · {meta.label}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>100</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted">
            <div
              className={cn('h-3 rounded-full transition-all', meta.bar)}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">위험 요인</p>
          {result.risk_reasons.length === 0 ? (
            <p className="text-sm text-muted-foreground">특별한 위험 요인이 감지되지 않았습니다.</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {result.risk_reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="text-sm font-medium">세부 점수</p>
          <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">금액 리스크</dt>
              <dd className="font-semibold">{breakdown.amount}점</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">시간 리스크</dt>
              <dd className="font-semibold">{breakdown.time}점</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">가맹점 리스크</dt>
              <dd className="font-semibold">{breakdown.merchant}점</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">위치 리스크</dt>
              <dd className="font-semibold">{breakdown.location}점</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg bg-muted p-4 text-sm">
          <p className="font-medium">다음 조치</p>
          <p className="text-muted-foreground">{meta.message}</p>
        </div>

        {result.transaction_id && (
          <p className="text-xs text-muted-foreground">거래 ID: {result.transaction_id}</p>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>리스크 분석 결과</CardTitle>
        <CardDescription>가상 결제 시뮬레이션의 판정 결과를 확인하세요.</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
