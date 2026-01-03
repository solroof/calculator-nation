import type { Metadata } from "next";
import { AlcoholCalculator } from "@/components/calculators/alcohol";

export const metadata: Metadata = {
  title: "음주 분해시간 계산기",
  description: "음주 후 알코올 분해시간을 계산합니다. 혈중알코올농도와 운전 가능 시간을 추정합니다.",
  keywords: ["음주 분해시간", "혈중알코올농도", "음주운전", "알코올 대사", "술 분해"],
};

export default function AlcoholPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <AlcoholCalculator />
      </section>
    </div>
  );
}
