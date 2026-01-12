import type { Metadata } from "next";
import { TriangleCalculator } from "@/components/calculators/triangle";

export const metadata: Metadata = {
  title: "삼각형 계산기",
  description: "삼각형의 변, 각도, 넓이를 계산합니다. 코사인 법칙, 사인 법칙, 피타고라스 정리를 적용합니다.",
  keywords: ["삼각형 계산기", "코사인 법칙", "사인 법칙", "피타고라스"],
};

export default function TrianglePage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <TriangleCalculator />
      </section>
    </div>
  );
}
