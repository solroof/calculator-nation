import type { Metadata } from "next";
import { BMRCalculator } from "@/components/calculators/bmr";

export const metadata: Metadata = {
  title: "기초대사량(BMR) 계산기",
  description: "기초대사량을 계산합니다. 성별, 나이, 키, 몸무게로 하루 필요 칼로리를 확인하세요.",
  keywords: ["기초대사량", "BMR 계산기", "칼로리 계산", "다이어트"],
};

export default function BMRPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <BMRCalculator />
      </section>
    </div>
  );
}
