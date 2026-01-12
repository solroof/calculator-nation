import type { Metadata } from "next";
import { DiscountCalculator } from "@/components/calculators/discount";

export const metadata: Metadata = {
  title: "할인율 계산기",
  description: "할인가와 할인율을 계산합니다. 정가와 할인율로 할인가를 계산하거나, 정가와 할인가로 할인율을 계산하세요.",
  keywords: ["할인율 계산기", "할인가", "세일 계산", "할인 계산"],
};

export default function DiscountPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <DiscountCalculator />
      </section>
    </div>
  );
}
