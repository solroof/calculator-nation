import type { Metadata } from "next";
import { SpeedCalculator } from "@/components/calculators/speed";

export const metadata: Metadata = {
  title: "속도 변환 계산기",
  description: "속도 단위를 변환합니다. km/h, mph, m/s, 노트, 마하 등 다양한 단위 간 변환이 가능합니다.",
  keywords: ["속도 변환", "단위 변환", "km/h", "mph", "m/s", "노트"],
};

export default function SpeedPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <SpeedCalculator />
      </section>
    </div>
  );
}
