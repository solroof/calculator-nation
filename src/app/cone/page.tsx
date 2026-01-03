import type { Metadata } from "next";
import { ConeCalculator } from "@/components/calculators/cone";

export const metadata: Metadata = {
  title: "원뿔 계산기 - 부피, 겉넓이",
  description: "원뿔의 부피와 겉넓이를 계산합니다. 반지름과 높이를 입력하세요.",
  keywords: ["원뿔 계산기", "원뿔 부피", "원뿔 겉넓이", "cone"],
};

export default function ConePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <ConeCalculator />
      </section>
    </div>
  );
}
