import type { Metadata } from "next";
import { CapitalGainsTaxCalculator } from "@/components/calculators/capital-gains-tax";

export const metadata: Metadata = {
  title: "양도소득세 계산기",
  description: "부동산 양도소득세를 계산합니다. 1세대 1주택 비과세, 장기보유특별공제 등을 적용하여 계산합니다.",
  keywords: ["양도소득세 계산기", "양도세", "부동산 세금", "장기보유특별공제"],
};

export default function CapitalGainsTaxPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <CapitalGainsTaxCalculator />
      </section>
    </div>
  );
}
