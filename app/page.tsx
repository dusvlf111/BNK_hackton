import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="p-8 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-2">BNK Hackton PWA</h1>
        <p className="text-slate-600">
          Next.js + Tailwind + PWA 기본 설정이 완료되었습니다.
        </p>
        <Link href="/user/payment-test">Payment Test 이동</Link>
      </div>
    </main>
  );
}
