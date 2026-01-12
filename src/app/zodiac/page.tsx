import type { Metadata } from "next";
import { ZodiacCalculator } from "@/components/calculators/zodiac";

export const metadata: Metadata = {
  title: "별자리/띠 계산기",
  description: "생년월일로 별자리와 띠(12간지)를 확인합니다. 서양 별자리와 동양 띠를 한번에 알아보세요.",
  keywords: ["별자리", "띠", "12간지", "생일 별자리", "운세"],
};

export default function ZodiacPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <ZodiacCalculator />
      </section>
    </div>
  );
}
