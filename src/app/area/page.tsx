import type { Metadata } from "next";
import { AreaCalculator } from "@/components/calculators/area";

export const metadata: Metadata = {
  title: "넓이 변환 계산기",
  description: "넓이 단위를 변환합니다. 제곱미터, 평, 에이커, 헥타르 등 다양한 단위 간 변환이 가능합니다.",
  keywords: ["넓이 변환", "단위 변환", "평", "제곱미터", "acre", "헥타르"],
};

export default function AreaPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <AreaCalculator />
      </section>
    </div>
  );
}
