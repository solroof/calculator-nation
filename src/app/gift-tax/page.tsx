import type { Metadata } from "next";
import { GiftTaxCalculator } from "@/components/calculators/gift-tax";

export const metadata: Metadata = {
  title: "증여세 계산기 - 2024년",
  description: "증여세를 계산합니다. 배우자, 자녀, 부모님 등 관계별 공제액과 세율을 적용한 정확한 증여세 계산.",
  keywords: ["증여세", "증여세 계산기", "증여재산공제", "증여세율", "자녀 증여"],
};

export default function GiftTaxPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <GiftTaxCalculator />
      </section>
    </div>
  );
}
