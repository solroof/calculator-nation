import type { Metadata } from "next";
import { PermutationCalculator } from "@/components/calculators/permutation";

export const metadata: Metadata = {
  title: "순열 조합 계산기 - nPr, nCr",
  description: "순열(nPr)과 조합(nCr)을 계산합니다. 중복순열, 중복조합, 팩토리얼도 함께 계산.",
  keywords: ["순열", "조합", "nPr", "nCr", "팩토리얼", "중복순열", "중복조합"],
};

export default function PermutationPage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <PermutationCalculator />
      </section>
    </div>
  );
}
