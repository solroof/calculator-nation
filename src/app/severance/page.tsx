import type { Metadata } from "next";
import { SeveranceCalculator } from "@/components/calculators/severance";

export const metadata: Metadata = {
  title: "퇴직금 계산기",
  description: "퇴직금을 정확하게 계산합니다. 근무 기간, 평균 임금 기준으로 예상 퇴직금을 확인하세요.",
  keywords: ["퇴직금 계산기", "퇴직금", "퇴직 정산", "평균임금"],
};

export default function SeverancePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <SeveranceCalculator />
      </section>
    </div>
  );
}
