import type { Metadata } from "next";
import { TemperatureCalculator } from "@/components/calculators/temperature";

export const metadata: Metadata = {
  title: "온도 변환 계산기",
  description: "섭씨, 화씨, 켈빈 온도를 변환합니다. °C ↔ °F ↔ K 온도 단위를 쉽게 변환하세요.",
  keywords: ["온도 변환", "섭씨 화씨", "켈빈", "온도 계산기"],
};

export default function TemperaturePage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <TemperatureCalculator />
      </section>
    </div>
  );
}
