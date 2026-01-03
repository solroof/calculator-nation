import type { Metadata } from "next";
import { UnemploymentCalculator } from "@/components/calculators/unemployment";

export const metadata: Metadata = {
  title: "실업급여 계산기",
  description: "실업급여 예상 수령액을 계산합니다. 고용보험 가입 기간과 평균 임금으로 실업급여를 확인하세요.",
  keywords: ["실업급여 계산기", "실업급여", "고용보험", "구직급여"],
};

export default function UnemploymentPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <UnemploymentCalculator />
      </section>
    </div>
  );
}
