import type { Metadata } from "next";
import { BaseConverter } from "@/components/calculators/base-converter";

export const metadata: Metadata = {
  title: "진법 변환기",
  description: "2진수, 8진수, 10진수, 16진수를 상호 변환합니다. 프로그래밍과 컴퓨터 공학에 유용한 도구입니다.",
  keywords: ["진법 변환", "2진수", "8진수", "10진수", "16진수", "binary", "hex"],
};

export default function BaseConverterPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <BaseConverter />
      </section>
    </div>
  );
}
