import type { Metadata } from "next";
import { QuadraticCalculator } from "@/components/calculators/quadratic";

export const metadata: Metadata = {
  title: "이차방정식 계산기 - 근의 공식",
  description: "이차방정식 ax² + bx + c = 0의 해를 구합니다. 근의 공식, 판별식, 실근/허근 계산.",
  keywords: ["이차방정식", "근의 공식", "판별식", "이차방정식 풀이", "허근"],
};

export default function QuadraticPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <QuadraticCalculator />
      </section>
    </div>
  );
}
