import type { Metadata } from "next";
import { DataSizeCalculator } from "@/components/calculators/data-size";

export const metadata: Metadata = {
  title: "데이터 용량 변환 계산기",
  description: "데이터 저장 용량 단위를 변환합니다. KB, MB, GB, TB 등 다양한 단위 간 변환이 가능합니다.",
  keywords: ["데이터 용량", "단위 변환", "KB", "MB", "GB", "TB"],
};

export default function DataSizePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <section className="bg-white rounded-2xl border border-gray-200 p-4">
        <DataSizeCalculator />
      </section>
    </div>
  );
}
