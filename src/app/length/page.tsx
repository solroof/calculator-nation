import type { Metadata } from "next";
import { LengthCalculator } from "@/components/calculators/length";

export const metadata: Metadata = {
  title: "길이 변환 계산기",
  description: "길이 단위를 변환합니다. 센티미터, 미터, 인치, 피트, 마일 등 다양한 단위 간 변환이 가능합니다.",
  keywords: ["길이 변환", "단위 변환", "cm", "m", "inch", "ft", "mile"],
};

export default function LengthPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <LengthCalculator />
      </section>
    </div>
  );
}
