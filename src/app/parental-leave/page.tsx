import type { Metadata } from "next";
import { ParentalLeaveCalculator } from "@/components/calculators/parental-leave";

export const metadata: Metadata = {
  title: "육아휴직 급여 계산기",
  description: "육아휴직 급여를 계산합니다. 통상임금 기준 육아휴직 기간별 예상 급여를 확인하세요.",
  keywords: ["육아휴직 계산기", "육아휴직 급여", "출산휴가", "육아휴직"],
};

export default function ParentalLeavePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <ParentalLeaveCalculator />
      </section>
    </div>
  );
}
