import type { Metadata } from "next";
import { BodyFatCalculator } from "@/components/calculators/body-fat";

export const metadata: Metadata = {
  title: "체지방률 계산기",
  description: "체지방률을 계산합니다. 키, 체중, 허리둘레 등을 입력하여 체지방 비율을 확인하세요.",
  keywords: ["체지방률", "체지방 계산", "다이어트", "체성분", "체지방"],
};

export default function BodyFatPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <BodyFatCalculator />
      </section>
    </div>
  );
}
