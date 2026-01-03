import type { Metadata } from "next";
import { LoanCalculator } from "@/components/calculators/loan";

export const metadata: Metadata = {
  title: "대출 이자 계산기",
  description: "대출 이자와 상환액을 계산합니다. 원리금균등, 원금균등, 만기일시 상환 방식별 계산을 지원합니다.",
  keywords: ["대출 계산기", "대출 이자", "원리금균등", "대출 상환"],
};

export default function LoanPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <LoanCalculator />
      </section>
    </div>
  );
}
