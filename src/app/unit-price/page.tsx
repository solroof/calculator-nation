import type { Metadata } from "next";
import { UnitPriceCalculator } from "@/components/calculators/unit-price";

export const metadata: Metadata = {
  title: "단가 비교 계산기",
  description: "상품의 단가를 비교하여 어느 것이 더 저렴한지 확인합니다. 마트 쇼핑에 유용한 도구입니다.",
  keywords: ["단가 비교", "가성비", "용량 대비 가격", "쇼핑 계산기"],
};

export default function UnitPricePage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <UnitPriceCalculator />
      </section>
    </div>
  );
}
