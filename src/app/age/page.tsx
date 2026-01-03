import type { Metadata } from "next";
import { AgeCalculator } from "@/components/calculators/age";

export const metadata: Metadata = {
  title: "만 나이 계산기",
  description: "만 나이를 계산합니다. 생년월일을 입력하면 현재 만 나이와 다음 생일까지 남은 일수를 확인할 수 있습니다.",
  keywords: ["만 나이 계산기", "나이 계산", "생년월일", "한국 나이"],
};

export default function AgePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <AgeCalculator />
      </section>
    </div>
  );
}
