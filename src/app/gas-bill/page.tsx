import type { Metadata } from "next";
import { GasBillCalculator } from "@/components/calculators/gas-bill";

export const metadata: Metadata = {
  title: "가스요금 계산기 - 도시가스",
  description: "도시가스 사용량을 입력하면 예상 가스요금을 계산합니다. 계절별 요금을 확인하세요.",
  keywords: ["가스요금", "도시가스", "가스비", "난방비", "가스요금 계산"],
};

export default function GasBillPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <GasBillCalculator />
      </section>
    </div>
  );
}
