import type { Metadata } from "next";
import { IncomeTaxCalculator } from "@/components/calculators/income-tax";

export const metadata: Metadata = {
  title: "종합소득세 계산기 - 2024년",
  description: "종합소득세를 계산합니다. 프리랜서, 사업소득자를 위한 소득세 및 지방소득세 계산.",
  keywords: ["종합소득세", "소득세 계산기", "프리랜서 세금", "사업소득세", "지방소득세"],
};

export default function IncomeTaxPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <IncomeTaxCalculator />
      </section>
    </div>
  );
}
