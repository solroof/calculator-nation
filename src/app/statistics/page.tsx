import type { Metadata } from "next";
import { StatisticsCalculator } from "@/components/calculators/statistics";

export const metadata: Metadata = {
  title: "통계 계산기 - 평균, 표준편차",
  description: "데이터의 평균, 중앙값, 최빈값, 표준편차, 분산을 계산합니다.",
  keywords: ["통계", "평균", "표준편차", "분산", "중앙값", "최빈값"],
};

export default function StatisticsPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <StatisticsCalculator />
      </section>
    </div>
  );
}
