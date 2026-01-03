import type { Metadata } from "next";
import { RentConversionCalculator } from "@/components/calculators/rent-conversion";

export const metadata: Metadata = {
  title: "전월세 전환 계산기",
  description: "전세를 월세로, 월세를 전세로 전환 시 적정 금액을 계산합니다. 전월세 전환율을 적용합니다.",
  keywords: ["전월세 전환", "전세 월세 변환", "전환율 계산", "임대차"],
};

export default function RentConversionPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <RentConversionCalculator />
      </section>
    </div>
  );
}
