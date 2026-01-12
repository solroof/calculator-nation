import type { Metadata } from "next";
import { PythagoreanCalculator } from "@/components/calculators/pythagorean";

export const metadata: Metadata = {
  title: "피타고라스 정리 계산기",
  description: "피타고라스 정리를 이용해 직각삼각형의 변을 계산합니다. a² + b² = c²",
  keywords: ["피타고라스", "직각삼각형", "빗변", "피타고라스 정리"],
};

export default function PythagoreanPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <PythagoreanCalculator />
      </section>
    </div>
  );
}
