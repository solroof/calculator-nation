import type { Metadata } from "next";
import { ShapeDividerCalculator } from "@/components/calculators/shape-divider";

export const metadata: Metadata = {
  title: "형상 분할 계산기",
  description: "도형을 여러 조각으로 분할할 때 각 조각의 크기를 계산합니다.",
  keywords: ["형상 분할", "도형 계산기", "분할 계산"],
};

export default function ShapeDividerPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <ShapeDividerCalculator />
      </section>
    </div>
  );
}
