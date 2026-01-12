import type { Metadata } from "next";
import { DateCalcCalculator } from "@/components/calculators/date-calc";

export const metadata: Metadata = {
  title: "날짜 계산기",
  description: "날짜를 더하거나 빼고, 두 날짜 사이의 기간을 계산합니다. 년, 월, 일 단위로 계산 가능합니다.",
  keywords: ["날짜 계산기", "날짜 더하기", "날짜 빼기", "기간 계산", "D-Day"],
};

export default function DateCalcPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <DateCalcCalculator />
      </section>
    </div>
  );
}
