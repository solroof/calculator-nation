import type { Metadata } from "next";
import { BMICalculator } from "@/components/calculators/bmi";

export const metadata: Metadata = {
  title: "BMI 계산기",
  description: "체질량지수(BMI)를 계산합니다. 키와 몸무게로 비만도를 확인하고 건강 상태를 점검하세요.",
  keywords: ["BMI 계산기", "체질량지수", "비만도", "건강 체중"],
};

export default function BMIPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <BMICalculator />
      </section>
    </div>
  );
}
