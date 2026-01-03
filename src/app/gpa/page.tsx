import type { Metadata } from "next";
import { GPACalculator } from "@/components/calculators/gpa";

export const metadata: Metadata = {
  title: "학점 계산기 (GPA)",
  description: "대학교 학점(GPA)을 계산합니다. 4.5, 4.3, 4.0 만점 체계를 지원합니다.",
  keywords: ["학점 계산기", "GPA", "평점", "대학 학점", "성적 계산"],
};

export default function GPAPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <GPACalculator />
      </section>
    </div>
  );
}
