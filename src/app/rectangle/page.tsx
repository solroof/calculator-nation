import type { Metadata } from "next";
import { RectangleCalculator } from "@/components/calculators/rectangle";

export const metadata: Metadata = {
  title: "사각형 계산기",
  description: "사각형의 넓이와 둘레를 계산합니다. 직사각형, 정사각형, 평행사변형, 사다리꼴을 지원합니다.",
  keywords: ["사각형 계산기", "넓이 계산", "둘레 계산", "직사각형", "정사각형", "평행사변형", "사다리꼴"],
};

export default function RectanglePage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <RectangleCalculator />
      </section>
    </div>
  );
}
