import type { Metadata } from "next";
import { GcdLcmCalculator } from "@/components/calculators/gcd-lcm";

export const metadata: Metadata = {
  title: "최대공약수/최소공배수 계산기",
  description: "최대공약수(GCD)와 최소공배수(LCM)를 계산합니다. 여러 숫자의 공약수와 공배수를 확인하세요.",
  keywords: ["최대공약수", "최소공배수", "GCD", "LCM", "공약수", "공배수"],
};

export default function GcdLcmPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <GcdLcmCalculator />
      </section>
    </div>
  );
}
