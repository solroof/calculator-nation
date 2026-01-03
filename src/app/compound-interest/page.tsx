import type { Metadata } from "next";
import { CompoundInterestCalculator } from "@/components/calculators/compound-interest";

export const metadata: Metadata = {
  title: "복리 계산기",
  description: "복리 이자를 계산합니다. 초기 투자금, 이율, 기간을 입력하여 복리로 불어나는 금액을 확인하세요.",
  keywords: ["복리 계산기", "복리 이자", "투자 계산", "이자 계산"],
};

export default function CompoundInterestPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <CompoundInterestCalculator />
      </section>
    </div>
  );
}
