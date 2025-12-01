"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MERCHANT_CATEGORIES,
  QUICK_SCENARIOS,
  getQuickScenarioValues,
  paymentSimulatorSchema,
  type PaymentSimulatorFormValues,
  type QuickScenarioId,
} from "@/lib/payment-simulator";
import type { PaymentSimulationInput } from "@/types/transaction.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

interface PaymentSimulatorProps {
  onSubmit: (values: PaymentSimulationInput) => Promise<void> | void;
  defaultValues?: Partial<PaymentSimulatorFormValues>;
  isSubmitting?: boolean;
}

export function PaymentSimulator({
  onSubmit,
  defaultValues,
  isSubmitting,
}: PaymentSimulatorProps) {
  const currentHour = useMemo(() => new Date().getHours(), []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting: formSubmitting },
  } = useForm({
    resolver: zodResolver(paymentSimulatorSchema),
    mode: "onChange",
    defaultValues: {
      amount: defaultValues?.amount ?? 5_000,
      merchant_name: defaultValues?.merchant_name ?? "",
      merchant_category:
        defaultValues?.merchant_category ?? MERCHANT_CATEGORIES[0],
      hour: defaultValues?.hour ?? currentHour,
    },
  });

  const submitting = isSubmitting ?? formSubmitting;

  const submitHandler = handleSubmit(async (values) => {
    const payload: PaymentSimulationInput = {
      amount: values.amount,
      merchant_name: values.merchant_name,
      merchant_category: values.merchant_category,
      hour: values.hour,
    };
    await onSubmit(payload);
  });

  const handleQuickScenarioSelect = (scenarioId: QuickScenarioId) => {
    const scenarioValues = getQuickScenarioValues(scenarioId);
    if (!scenarioValues) {
      return;
    }
    reset(scenarioValues);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>결제 시뮬레이터</CardTitle>
        <CardDescription>
          테스트 결제 정보를 입력하고 리스크 점수를 확인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={submitHandler}>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              빠른 시나리오
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {QUICK_SCENARIOS.map((scenario) => (
                <Button
                  key={scenario.id}
                  type="button"
                  variant="secondary"
                  className="h-auto items-start justify-start text-left"
                  disabled={submitting}
                  onClick={() => handleQuickScenarioSelect(scenario.id)}
                >
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {scenario.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {scenario.description}
                    </span>
                  </span>
                </Button>
              ))}
            </div>
          </div>

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
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
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
              {...register("merchant_name")}
            />
            {errors.merchant_name && (
              <p className="text-sm text-red-600">
                {errors.merchant_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="merchant_category">
              가맹점 업종
            </label>
            <select
              id="merchant_category"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("merchant_category")}
            >
              {MERCHANT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.merchant_category && (
              <p className="text-sm text-red-600">
                {errors.merchant_category.message}
              </p>
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
              {...register("hour", { valueAsNumber: true })}
            />
            {errors.hour && (
              <p className="text-sm text-red-600">{errors.hour.message}</p>
            )}
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={!isValid || submitting}
          >
            {submitting ? "계산 중..." : "리스크 분석 요청"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        입력 데이터는 실제 결제가 아닌 시뮬레이션 용도로만 사용됩니다.
      </CardFooter>
    </Card>
  );
}
