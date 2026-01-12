import type { Metadata } from "next";
import { SavingsCalculator } from "@/components/calculators/savings";

export const metadata: Metadata = {
  title: "적금/예금 이자 계산기",
  description: "적금, 예금 만기 수령액을 계산합니다. 단리, 복리 이자 계산과 세금 공제를 적용합니다.",
  keywords: ["적금 계산기", "예금 이자", "복리 계산", "만기 수령액"],
};

export default function SavingsPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <SavingsCalculator />
      </section>
    </div>
  );
}
