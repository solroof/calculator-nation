import type { Metadata } from "next";
import { PressureConverter } from "@/components/calculators/pressure";

export const metadata: Metadata = {
  title: "압력 변환 - Pa, bar, atm, psi",
  description: "압력 단위를 변환합니다. 파스칼, 바, 기압, PSI, mmHg 등 다양한 압력 단위 변환.",
  keywords: ["압력 변환", "Pa", "bar", "atm", "psi", "mmHg", "기압"],
};

export default function PressurePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <PressureConverter />
      </section>
    </div>
  );
}
