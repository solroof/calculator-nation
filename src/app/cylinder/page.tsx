import type { Metadata } from "next";
import { CylinderCalculator } from "@/components/calculators/cylinder";

export const metadata: Metadata = {
  title: "원기둥 계산기 - 부피, 겉넓이",
  description: "원기둥의 부피와 겉넓이를 계산합니다. 반지름과 높이를 입력하세요.",
  keywords: ["원기둥 계산기", "원기둥 부피", "원기둥 겉넓이", "cylinder"],
};

export default function CylinderPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <CylinderCalculator />
      </section>
    </div>
  );
}
