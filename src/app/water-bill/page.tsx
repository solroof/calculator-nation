import type { Metadata } from "next";
import { WaterBillCalculator } from "@/components/calculators/water-bill";

export const metadata: Metadata = {
  title: "수도요금 계산기 - 상하수도",
  description: "수도 사용량으로 예상 수도요금을 계산합니다. 상수도, 하수도, 물이용부담금 포함.",
  keywords: ["수도요금", "상수도", "하수도", "수도요금 계산기", "물값"],
};

export default function WaterBillPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <WaterBillCalculator />
      </section>
    </div>
  );
}
