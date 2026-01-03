import type { Metadata } from "next";
import { ShoeSizeConverter } from "@/components/calculators/shoe-size";

export const metadata: Metadata = {
  title: "신발 사이즈 변환 - 한국/미국/유럽",
  description: "신발 사이즈를 변환합니다. 한국, 미국, 유럽, 영국 사이즈 변환. 해외직구에 유용!",
  keywords: ["신발 사이즈", "신발 사이즈 변환", "US 사이즈", "EU 사이즈", "해외직구"],
};

export default function ShoeSizePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <ShoeSizeConverter />
      </section>
    </div>
  );
}
