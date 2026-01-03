import type { Metadata } from "next";
import { WeightCalculator } from "@/components/calculators/weight";

export const metadata: Metadata = {
  title: "무게 변환 계산기",
  description: "무게 단위를 변환합니다. 킬로그램, 그램, 파운드, 온스 등 다양한 단위 간 변환이 가능합니다.",
  keywords: ["무게 변환", "단위 변환", "kg", "lb", "oz", "gram"],
};

export default function WeightPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <WeightCalculator />
      </section>
    </div>
  );
}
