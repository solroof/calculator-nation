import type { Metadata } from "next";
import { RandomCalculator } from "@/components/calculators/random";

export const metadata: Metadata = {
  title: "랜덤 숫자 생성기",
  description: "무작위 숫자를 생성합니다. 로또 번호, 제비뽑기, 추첨 등에 활용하세요.",
  keywords: ["랜덤 숫자", "무작위 번호", "로또 번호", "추첨"],
};

export default function RandomPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <RandomCalculator />
      </section>
    </div>
  );
}
