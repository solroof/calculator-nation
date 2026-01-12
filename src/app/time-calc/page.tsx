import type { Metadata } from "next";
import { TimeCalcCalculator } from "@/components/calculators/time-calc";

export const metadata: Metadata = {
  title: "시간 계산기",
  description: "시간을 더하거나 빼고, 두 시간의 차이를 계산합니다. 분, 시간, 초 단위 변환도 가능합니다.",
  keywords: ["시간 계산기", "시간 더하기", "시간 빼기", "시간 변환", "근무시간"],
};

export default function TimeCalcPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <TimeCalcCalculator />
      </section>
    </div>
  );
}
