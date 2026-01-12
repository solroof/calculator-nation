import type { Metadata } from "next";
import { AcquisitionTaxCalculator } from "@/components/calculators/acquisition-tax";

export const metadata: Metadata = {
  title: "부동산 취득세 계산기",
  description: "부동산 취득세를 계산합니다. 주택, 토지, 상가 등 부동산 종류별 취득세율을 적용하여 계산합니다.",
  keywords: ["취득세 계산기", "부동산 취득세", "주택 취득세", "부동산 세금"],
};

export default function AcquisitionTaxPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <AcquisitionTaxCalculator />
      </section>
    </div>
  );
}
