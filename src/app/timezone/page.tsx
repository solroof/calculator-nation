import type { Metadata } from "next";
import { TimezoneConverter } from "@/components/calculators/timezone";

export const metadata: Metadata = {
  title: "시간대 변환 - 세계 시간",
  description: "세계 각국의 시간을 변환합니다. 한국, 미국, 유럽, 아시아 등 주요 도시 시간 비교.",
  keywords: ["시간대 변환", "세계 시간", "타임존", "시차 계산", "미국 시간"],
};

export default function TimezonePage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <TimezoneConverter />
      </section>
    </div>
  );
}
