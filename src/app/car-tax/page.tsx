import type { Metadata } from "next";
import { CarTaxCalculator } from "@/components/calculators/car-tax";

export const metadata: Metadata = {
  title: "자동차세 계산기",
  description: "연간 자동차세를 계산합니다. 배기량, 차량 연식에 따른 자동차세와 지방교육세를 확인하세요.",
  keywords: ["자동차세", "자동차세 계산", "차량세", "지방교육세", "자동차 세금"],
};

export default function CarTaxPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <CarTaxCalculator />
      </section>
    </div>
  );
}
