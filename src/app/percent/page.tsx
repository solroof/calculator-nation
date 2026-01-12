import type { Metadata } from "next";
import { PercentCalculator } from "@/components/calculators/percent";

export const metadata: Metadata = {
  title: "퍼센트 계산기",
  description: "퍼센트 계산을 쉽게 할 수 있습니다. 퍼센트 값, 비율, 증감률을 계산하세요.",
  keywords: ["퍼센트 계산기", "비율 계산", "증감률", "% 계산"],
};

export default function PercentPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <PercentCalculator />
      </section>
    </div>
  );
}
