import type { Metadata } from "next";
import { WaterIntakeCalculator } from "@/components/calculators/water-intake";

export const metadata: Metadata = {
  title: "물 섭취량 계산기",
  description: "하루 권장 물 섭취량을 계산합니다. 체중과 활동량에 맞는 적정 수분 섭취량을 확인하세요.",
  keywords: ["물 섭취량", "수분 섭취", "하루 물", "건강 물", "수분 권장량"],
};

export default function WaterIntakePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <WaterIntakeCalculator />
      </section>
    </div>
  );
}
