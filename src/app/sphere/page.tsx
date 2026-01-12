import type { Metadata } from "next";
import { SphereCalculator } from "@/components/calculators/sphere";

export const metadata: Metadata = {
  title: "구 계산기 - 부피, 겉넓이",
  description: "구의 부피와 겉넓이를 계산합니다. 반지름, 지름, 부피, 겉넓이 중 하나만 알면 모두 계산.",
  keywords: ["구 계산기", "구 부피", "구 겉넓이", "구 넓이", "sphere"],
};

export default function SpherePage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <SphereCalculator />
      </section>
    </div>
  );
}
