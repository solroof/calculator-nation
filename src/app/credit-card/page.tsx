import type { Metadata } from "next";
import { CreditCardCalculator } from "@/components/calculators/credit-card";

export const metadata: Metadata = {
  title: "신용카드 이자 계산기 - 할부/리볼빙",
  description: "신용카드 할부 이자와 리볼빙 이자를 계산합니다. 월 납입금과 총 이자를 확인하세요.",
  keywords: ["신용카드 이자", "할부 이자", "리볼빙", "카드 할부", "할부 계산기"],
};

export default function CreditCardPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <CreditCardCalculator />
      </section>
    </div>
  );
}
