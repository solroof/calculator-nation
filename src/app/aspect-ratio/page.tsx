import type { Metadata } from "next";
import { AspectRatioCalculator } from "@/components/calculators/aspect-ratio";

export const metadata: Metadata = {
  title: "사진 비율 계산기 - 화면비, 이미지 크기",
  description: "이미지의 화면비를 계산하고 비율을 유지하며 크기를 조정합니다. 4:3, 16:9 등 화면비 계산.",
  keywords: ["화면비", "사진 비율", "16:9", "4:3", "이미지 크기", "aspect ratio"],
};

export default function AspectRatioPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <AspectRatioCalculator />
      </section>
    </div>
  );
}
