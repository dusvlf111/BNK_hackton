import { z } from 'zod';

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
] as const;

const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const paymentSimulatorSchema = z.object({
  amount: z.coerce.number().min(1_000, '금액은 최소 1,000원 이상이어야 합니다.').max(10_000_000, '금액은 최대 10,000,000원까지 입력 가능합니다.'),
  merchant_name: z.string().min(1, '가맹점명을 입력하세요.').max(50, '가맹점명은 50자 이내여야 합니다.'),
  merchant_category: z.enum(MERCHANT_CATEGORIES, {
    error: '가맹점 업종을 선택하세요.',
  }),
  hour: z.coerce.number().min(0, '시간은 0-23 범위여야 합니다.').max(23, '시간은 0-23 범위여야 합니다.'),
  location: locationSchema.optional().nullable(),
})

export type PaymentSimulatorFormValues = z.infer<typeof paymentSimulatorSchema>

type QuickScenarioDefinition = {
  id: 'normal' | 'high' | 'night'
  label: string
  description: string
  values: PaymentSimulatorFormValues
}

export const QUICK_SCENARIOS: QuickScenarioDefinition[] = [
  {
    id: 'normal',
    label: '정상 결제',
    description: '일상적인 소액 편의점 결제',
    values: {
      amount: 5_000,
      merchant_name: 'GS25 강남점',
      merchant_category: '편의점',
      hour: 13,
    },
  },
  {
    id: 'high',
    label: '고액 결제',
    description: '오후 온라인 쇼핑 고액 결제',
    values: {
      amount: 3_000_000,
      merchant_name: '쿠팡 프라임',
      merchant_category: '온라인쇼핑',
      hour: 14,
    },
  },
  {
    id: 'night',
    label: '새벽 결제',
    description: '새벽 시간대 온라인 결제',
    values: {
      amount: 500_000,
      merchant_name: '무신사 스토어',
      merchant_category: '온라인쇼핑',
      hour: 2,
    },
  },
]

export type QuickScenarioId = QuickScenarioDefinition['id']

export function getQuickScenarioValues(id: QuickScenarioId | string) {
  return QUICK_SCENARIOS.find((scenario) => scenario.id === id)?.values
}
