import type { Metadata } from "next";
import { BrokerageFeeCalculator } from "@/components/calculators/brokerage-fee";

export const metadata: Metadata = {
  title: "부동산 중개수수료 계산기",
  description: "부동산 중개수수료를 계산합니다. 매매, 전세, 월세 거래 시 예상 중개보수를 확인하세요.",
  keywords: ["중개수수료", "부동산 수수료", "복비", "중개보수", "부동산 거래"],
};

export default function BrokerageFeePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <BrokerageFeeCalculator />
      </section>
    </div>
  );
}
