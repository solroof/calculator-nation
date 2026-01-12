import type { Metadata } from "next";
import { DDayCalculator } from "@/components/calculators/dday";

export const metadata: Metadata = {
  title: "D-Day 계산기",
  description: "특별한 날까지 남은 일수를 계산합니다. 기념일, 시험일, 여행일 등 중요한 날짜를 카운트다운하세요.",
  keywords: ["D-Day 계산기", "날짜 카운트", "기념일", "남은 일수"],
};

export default function DDayPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <DDayCalculator />
      </section>
    </div>
  );
}
