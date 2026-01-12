import type { Metadata } from "next";
import { FuelEconomyCalculator } from "@/components/calculators/fuel-economy";

export const metadata: Metadata = {
  title: "연비 계산기",
  description: "자동차 연비를 계산합니다. 주행거리와 주유량으로 연비 계산, 예상 주유비, 최대 주행거리를 확인하세요.",
  keywords: ["연비 계산기", "연비", "주유비", "km/L", "자동차 연비"],
};

export default function FuelEconomyPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <FuelEconomyCalculator />
      </section>
    </div>
  );
}
