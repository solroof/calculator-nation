import type { Metadata } from "next";
import { Base64Converter } from "@/components/calculators/base64";

export const metadata: Metadata = {
  title: "Base64 인코딩/디코딩",
  description: "텍스트를 Base64로 인코딩하거나 Base64를 텍스트로 디코딩합니다.",
  keywords: ["Base64", "인코딩", "디코딩", "Base64 변환기"],
};

export default function Base64Page() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <Base64Converter />
      </section>
    </div>
  );
}
