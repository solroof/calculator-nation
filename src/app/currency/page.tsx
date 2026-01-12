import type { Metadata } from "next";
import { CurrencyCalculator } from "@/components/calculators/currency";

export const metadata: Metadata = {
  title: "환율 계산기 - 통화 환전",
  description: "원화, 달러, 엔화, 유로 등 주요 통화 환율을 계산합니다. 여행, 해외직구에 유용한 환전 계산기입니다.",
  keywords: ["환율 계산기", "환전", "달러 환율", "엔화 환율", "유로 환율"],
};

export default function CurrencyPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <CurrencyCalculator />
      </section>
    </div>
  );
}
