import type { Metadata } from "next";
import { CircleCalculator } from "@/components/calculators/circle";

export const metadata: Metadata = {
  title: "원 계산기",
  description: "원의 넓이, 둘레, 반지름, 지름을 계산합니다. 반지름, 지름, 넓이, 둘레 중 하나만 알면 모든 값을 계산할 수 있습니다.",
  keywords: ["원 계산기", "원 넓이", "원 둘레", "반지름", "지름", "원주율"],
};

export default function CirclePage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <CircleCalculator />
      </section>
    </div>
  );
}
