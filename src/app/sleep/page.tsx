import type { Metadata } from "next";
import { SleepCalculator } from "@/components/calculators/sleep";

export const metadata: Metadata = {
  title: "수면 사이클 계산기",
  description: "수면 사이클에 맞춰 최적의 기상 또는 취침 시간을 계산합니다. 개운하게 일어나는 시간을 찾아보세요.",
  keywords: ["수면 사이클", "수면 계산기", "기상 시간", "취침 시간", "REM 수면"],
};

export default function SleepPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <SleepCalculator />
      </section>
    </div>
  );
}
