import type { Metadata } from "next";
import { RomanConverter } from "@/components/calculators/roman";

export const metadata: Metadata = {
  title: "로마 숫자 변환기",
  description: "아라비아 숫자를 로마 숫자로, 로마 숫자를 아라비아 숫자로 변환합니다.",
  keywords: ["로마 숫자", "로마 숫자 변환", "I V X L C D M", "Roman numerals"],
};

export default function RomanPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <RomanConverter />
      </section>
    </div>
  );
}
