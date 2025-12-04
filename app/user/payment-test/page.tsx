"use client";

import { PaymentSimulator } from "@/components/PaymentSimulator";
import { RiskResultCard } from "@/components/RiskResultCard";
import useLoginGuard from "@/hooks/useLoginGuard";
import { usePaymentSimulation } from "@/hooks/usePaymentSimulation";

export default function PaymentTestPage() {
  useLoginGuard();
  const { result, error, isSubmitting, simulate } = usePaymentSimulation();

  return (
    <main className="container mx-auto max-w-5xl space-y-8 py-10">
      <section className="space-y-3 text-center">
        <p className="text-sm font-semibold text-primary">케어페이 가디언</p>
        <h1 className="text-3xl font-bold">결제 리스크 시뮬레이터</h1>
        <p className="text-muted-foreground">
          가상의 결제 정보를 입력하면 실시간으로 리스크 점수와 후속 조치를
          확인할 수 있습니다.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <PaymentSimulator onSubmit={simulate} isSubmitting={isSubmitting} />
        <RiskResultCard
          result={result}
          isLoading={isSubmitting && !result}
          error={error}
        />
      </section>

      <section className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        <p>
          * 실제 결제가 이뤄지지 않으며 모든 데이터는 시뮬레이션 용도로만
          사용됩니다.
        </p>
      </section>
    </main>
  );
}
