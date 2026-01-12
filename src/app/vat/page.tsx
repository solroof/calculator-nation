import type { Metadata } from "next";
import { VATCalculator } from "@/components/calculators/vat";

export const metadata: Metadata = {
  title: "부가세(VAT) 계산기",
  description: "부가가치세 10%를 계산합니다. 공급가에 VAT를 추가하거나, 합계에서 VAT를 분리하세요.",
  keywords: ["부가세 계산기", "VAT 계산기", "부가가치세", "세금 계산"],
};

export default function VATPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <VATCalculator />
      </section>
    </div>
  );
}
