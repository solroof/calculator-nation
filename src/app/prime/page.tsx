import type { Metadata } from "next";
import { PrimeCalculator } from "@/components/calculators/prime";

export const metadata: Metadata = {
  title: "소수 계산기",
  description: "소수 여부를 판별하고 소인수분해를 수행합니다. 범위 내의 소수 목록도 확인할 수 있습니다.",
  keywords: ["소수", "소인수분해", "소수 판별", "Prime Number", "약수"],
};

export default function PrimePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <PrimeCalculator />
      </section>
    </div>
  );
}
