import type { Metadata } from "next";
import { PensionCalculator } from "@/components/calculators/pension";

export const metadata: Metadata = {
  title: "국민연금 계산기",
  description: "국민연금 예상 수령액을 계산합니다. 월 평균 소득과 가입기간을 입력하여 예상 연금액을 확인하세요.",
  keywords: ["국민연금", "연금 계산기", "노후 대비", "연금 수령액", "국민연금 예상"],
};

export default function PensionPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <PensionCalculator />
      </section>
    </div>
  );
}
