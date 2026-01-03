import type { Metadata } from "next";
import { VolumeConverter } from "@/components/calculators/volume";

export const metadata: Metadata = {
  title: "부피 변환 - L, mL, 컵, 갤런",
  description: "부피 단위를 변환합니다. 리터, 밀리리터, 컵, 갤런, 온스 등 요리와 일상에 필요한 부피 변환.",
  keywords: ["부피 변환", "리터", "밀리리터", "컵", "갤런", "온스"],
};

export default function VolumePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <VolumeConverter />
      </section>
    </div>
  );
}
