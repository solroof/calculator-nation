import type { Metadata } from "next";
import { CalorieCalculator } from "@/components/calculators/calorie";

export const metadata: Metadata = {
  title: "칼로리 계산기",
  description: "음식별 칼로리를 계산합니다. 하루 섭취 칼로리를 관리하고 다이어트에 활용하세요.",
  keywords: ["칼로리 계산기", "음식 칼로리", "다이어트", "식단 관리", "열량 계산"],
};

export default function CaloriePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <CalorieCalculator />
      </section>
    </div>
  );
}
