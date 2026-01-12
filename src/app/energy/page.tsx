import type { Metadata } from "next";
import { EnergyConverter } from "@/components/calculators/energy";

export const metadata: Metadata = {
  title: "에너지 변환 - J, cal, kWh",
  description: "에너지 단위를 변환합니다. 줄, 칼로리, 킬로와트시, BTU 등 다양한 에너지 단위 변환.",
  keywords: ["에너지 변환", "줄", "칼로리", "kWh", "BTU", "열량"],
};

export default function EnergyPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <EnergyConverter />
      </section>
    </div>
  );
}
