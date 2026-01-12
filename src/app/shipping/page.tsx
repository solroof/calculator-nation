import type { Metadata } from "next";
import { ShippingCalculator } from "@/components/calculators/shipping";

export const metadata: Metadata = {
  title: "택배비 계산기 - 크기/무게별 요금",
  description: "택배 크기와 무게로 예상 택배비를 계산합니다. 택배사별 요금 비교.",
  keywords: ["택배비", "택배 요금", "배송비", "택배비 계산기", "부피무게"],
};

export default function ShippingPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <ShippingCalculator />
      </section>
    </div>
  );
}
