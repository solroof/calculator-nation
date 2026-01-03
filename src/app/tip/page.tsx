import type { Metadata } from "next";
import { TipCalculator } from "@/components/calculators/tip";

export const metadata: Metadata = {
  title: "팁/더치페이 계산기",
  description: "팁과 더치페이를 계산합니다. 총 금액과 인원수를 입력하면 1인당 금액을 계산해줍니다.",
  keywords: ["팁 계산기", "더치페이", "N빵", "1인당 금액", "나눠내기"],
};

export default function TipPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <TipCalculator />
      </section>
    </div>
  );
}
