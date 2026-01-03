import type { Metadata } from "next";
import { PyeongCalculator } from "@/components/calculators/pyeong";

export const metadata: Metadata = {
  title: "평수 변환 계산기",
  description: "평(坪)과 제곱미터(㎡)를 변환합니다. 아파트, 주택 면적을 쉽게 변환하세요.",
  keywords: ["평수 계산기", "평 제곱미터", "면적 변환", "아파트 평수"],
};

export default function PyeongPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <PyeongCalculator />
      </section>
    </div>
  );
}
