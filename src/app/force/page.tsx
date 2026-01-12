import type { Metadata } from "next";
import { ForceConverter } from "@/components/calculators/force";

export const metadata: Metadata = {
  title: "힘 변환 - N, kgf, lbf",
  description: "힘의 단위를 변환합니다. 뉴턴, 킬로그램힘, 파운드힘 등 다양한 힘 단위 변환.",
  keywords: ["힘 변환", "뉴턴", "킬로그램힘", "파운드힘", "N", "kgf", "lbf"],
};

export default function ForcePage() {
  return (
    <div className="max-w-lg lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
      <section className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
        <ForceConverter />
      </section>
    </div>
  );
}
