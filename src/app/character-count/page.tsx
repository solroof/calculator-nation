import type { Metadata } from "next";
import { CharacterCountCalculator } from "@/components/calculators/character-count";

export const metadata: Metadata = {
  title: "글자수 세기",
  description: "텍스트의 글자수, 단어수, 바이트수를 계산합니다. 공백 포함/제외 옵션을 지원합니다.",
  keywords: ["글자수 세기", "문자수 계산", "단어수", "바이트 계산"],
};

export default function CharacterCountPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <CharacterCountCalculator />
      </section>
    </div>
  );
}
