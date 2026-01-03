import type { Metadata } from "next";
import { ElectricityCalculator } from "@/components/calculators/electricity";

export const metadata: Metadata = {
  title: "전기요금 계산기",
  description: "주택용 전기요금을 계산합니다. 사용량(kWh)을 입력하면 누진제가 적용된 예상 요금을 확인할 수 있습니다.",
  keywords: ["전기요금", "전기세", "누진제", "kWh", "전력요금"],
};

export default function ElectricityPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <ElectricityCalculator />
      </section>
    </div>
  );
}
