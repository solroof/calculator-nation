import type { Metadata } from "next";
import { RatioCalculator } from "@/components/calculators/ratio";

export const metadata: Metadata = {
  title: "비율 계산기 - 비례식, 비율 분배",
  description: "비례식을 풀고, 비율을 계산하고, 비율대로 분배합니다.",
  keywords: ["비율", "비례식", "비율 분배", "비례 계산기"],
};

export default function RatioPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <RatioCalculator />
      </section>
    </div>
  );
}
