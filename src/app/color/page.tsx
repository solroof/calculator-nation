import type { Metadata } from "next";
import { ColorConverter } from "@/components/calculators/color";

export const metadata: Metadata = {
  title: "색상 변환기",
  description: "HEX, RGB, HSL 색상 코드를 상호 변환합니다. 웹 디자인과 개발에 유용한 도구입니다.",
  keywords: ["색상 변환", "HEX", "RGB", "HSL", "컬러코드", "색상 선택기"],
};

export default function ColorPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <ColorConverter />
      </section>
    </div>
  );
}
