import type { Metadata } from "next";
import { SalaryCalculator } from "@/components/calculators/salary";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기",
  description: "2024년 기준 연봉 실수령액을 계산합니다. 4대보험, 소득세, 지방소득세 공제 후 실제 수령 금액을 확인하세요.",
  keywords: ["연봉 계산기", "실수령액", "4대보험", "소득세", "급여 계산"],
};

export default function SalaryPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <SalaryCalculator />
      </section>
    </div>
  );
}
