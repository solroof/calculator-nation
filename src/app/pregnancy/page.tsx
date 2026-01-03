import type { Metadata } from "next";
import { PregnancyCalculator } from "@/components/calculators/pregnancy";

export const metadata: Metadata = {
  title: "임신 주수 계산기",
  description: "마지막 생리일 또는 출산 예정일로 현재 임신 주수를 계산합니다. 출산 예정일과 임신 진행 상황을 확인하세요.",
  keywords: ["임신 주수", "출산 예정일", "임신 계산기", "D-Day", "임신 주수 계산"],
};

export default function PregnancyPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <PregnancyCalculator />
      </section>
    </div>
  );
}
