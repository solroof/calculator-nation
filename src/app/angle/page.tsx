import type { Metadata } from "next";
import { AngleConverter } from "@/components/calculators/angle";

export const metadata: Metadata = {
  title: "각도 변환 - 도, 라디안",
  description: "각도 단위를 변환합니다. 도, 라디안, 그라디안 변환 및 삼각함수 값 계산.",
  keywords: ["각도 변환", "라디안", "도", "그라디안", "삼각함수"],
};

export default function AnglePage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <AngleConverter />
      </section>
    </div>
  );
}
