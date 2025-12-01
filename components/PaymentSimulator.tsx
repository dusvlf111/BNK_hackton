'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PaymentSimulationInput } from '@/types/transaction.types'

export const MERCHANT_CATEGORIES = [
  '편의점',
  '마트/대형유통',
  '식당/카페',
  '온라인쇼핑',
  '병원/약국',
  '교통/모빌리티',
  '교육',
  '문화/여가',
  '해외결제',
  '금융서비스',
  '공공요금',
  '기타',
] as const

export const paymentSimulatorSchema = z.object({
  amount: z.coerce.number().min(1_000, '금액은 최소 1,000원 이상이어야 합니다.').max(10_000_000, '금액은 최대 10,000,000원까지 입력 가능합니다.'),
  merchant_name: z.string().min(1, '가맹점명을 입력하세요.').max(50, '가맹점명은 50자 이내여야 합니다.'),
  merchant_category: z.enum(MERCHANT_CATEGORIES, {
    errorMap: () => ({ message: '가맹점 업종을 선택하세요.' }),
  }),
  hour: z.coerce.number().min(0, '시간은 0-23 범위여야 합니다.').max(23, '시간은 0-23 범위여야 합니다.'),
})

export type PaymentSimulatorFormValues = z.infer<typeof paymentSimulatorSchema>

interface PaymentSimulatorProps {
  onSubmit: (values: PaymentSimulationInput) => Promise<void> | void
  defaultValues?: Partial<PaymentSimulatorFormValues>
  isSubmitting?: boolean
}

export function PaymentSimulator({ onSubmit, defaultValues, isSubmitting }: PaymentSimulatorProps) {
  const currentHour = useMemo(() => new Date().getHours(), [])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting: formSubmitting },
  } = useForm<PaymentSimulatorFormValues>({
    resolver: zodResolver(paymentSimulatorSchema),
    mode: 'onChange',
    defaultValues: {
      amount: defaultValues?.amount ?? 5_000,
      merchant_name: defaultValues?.merchant_name ?? '',
      merchant_category: defaultValues?.merchant_category ?? MERCHANT_CATEGORIES[0],
      hour: defaultValues?.hour ?? currentHour,
    },
  })

  const submitting = isSubmitting ?? formSubmitting

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>결제 시뮬레이터</CardTitle>
        <CardDescription>테스트 결제 정보를 입력하고 리스크 점수를 확인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="amount">
              결제 금액 (원)
            </label>
            <Input
              id="amount"
              type="number"
              step="1000"
              min={1000}
              max={10_000_000}
              placeholder="예: 5000"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="merchant_name">
              가맹점명
            </label>
            <Input
              id="merchant_name"
              type="text"
              placeholder="예: GS25 강남점"
              maxLength={50}
              {...register('merchant_name')}
            />
            {errors.merchant_name && (
              <p className="text-sm text-red-600">{errors.merchant_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="merchant_category">
              가맹점 업종
            </label>
            <select
              id="merchant_category"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('merchant_category')}
            >
              {MERCHANT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.merchant_category && (
              <p className="text-sm text-red-600">{errors.merchant_category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="hour">
              결제 시간 (0-23시)
            </label>
            <Input
              id="hour"
              type="number"
              min={0}
              max={23}
              placeholder="예: 13"
              {...register('hour', { valueAsNumber: true })}
            />
            {errors.hour && <p className="text-sm text-red-600">{errors.hour.message}</p>}
          </div>

          <Button className="w-full" type="submit" disabled={!isValid || submitting}>
            {submitting ? '계산 중...' : '리스크 분석 요청'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        입력 데이터는 실제 결제가 아닌 시뮬레이션 용도로만 사용됩니다.
      </CardFooter>
    </Card>
  )
}
