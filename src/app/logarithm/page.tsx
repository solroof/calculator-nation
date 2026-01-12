import type { Metadata } from "next";
import { LogarithmCalculator } from "@/components/calculators/logarithm";

export const metadata: Metadata = {
  title: "로그 계산기 - log, ln",
  description: "로그를 계산합니다. 상용로그(log), 자연로그(ln), 밑을 지정한 로그 계산.",
  keywords: ["로그", "log", "ln", "자연로그", "상용로그", "로그 계산기"],
};

export default function LogarithmPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <LogarithmCalculator />
      </section>
    </div>
  );
}
