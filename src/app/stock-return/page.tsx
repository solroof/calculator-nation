import type { Metadata } from "next";
import { StockReturnCalculator } from "@/components/calculators/stock-return";

export const metadata: Metadata = {
  title: "주식 수익률 계산기",
  description: "주식 매매 수익률을 계산합니다. 수수료, 세금을 포함한 실제 순수익을 확인하세요.",
  keywords: ["주식 수익률", "주식 계산기", "매매 수익", "증권 수수료"],
};

export default function StockReturnPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <StockReturnCalculator />
      </section>
    </div>
  );
}
