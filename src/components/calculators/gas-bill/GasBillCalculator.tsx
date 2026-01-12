"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

// 2024년 기준 도시가스 요금 (서울도시가스 기준, MJ당)
const gasRates = {
  summer: { base: 1010, usage: 19.69 }, // 4~6월
  winter: { base: 1010, usage: 19.69 }, // 11~3월
  other: { base: 1010, usage: 19.69 },  // 7~10월
};

export function GasBillCalculator() {
  const [usage, setUsage] = useState<number>(30);
  const [season, setSeason] = useState("winter");

  const calculate = () => {
    const usageValue = usage || 0;
    const rates = gasRates[season as keyof typeof gasRates];

    // MJ를 m³로 변환 (1m³ ≈ 43.1MJ)
    const mjToM3 = 43.1;
    const usageMJ = usageValue * mjToM3;

    const baseFee = rates.base;
    const usageFee = usageMJ * rates.usage;
    const subtotal = baseFee + usageFee;
    const vat = subtotal * 0.1;
    const total = subtotal + vat;

    return {
      baseFee,
      usageFee: Math.round(usageFee),
      subtotal: Math.round(subtotal),
      vat: Math.round(vat),
      total: Math.round(total),
      usageMJ: Math.round(usageMJ),
    };
  };

  const result = calculate();

  return (
    <div id="gas-bill" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">가스요금 계산기</h2>
          <p className="text-xs text-gray-500">도시가스 요금 계산</p>
        </div>
        <span className="text-2xl">🔥</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">사용량 (m³)</label>
          <NumberInput
            value={usage}
            onChange={setUsage}
            min={0}
            step={1}
            format="comma"
            suffix="m³"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">계절</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "winter", label: "동절기", sub: "11~3월" },
              { key: "summer", label: "하절기", sub: "4~6월" },
              { key: "other", label: "기타", sub: "7~10월" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setSeason(item.key)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  season === item.key
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className={`font-medium text-sm ${season === item.key ? "text-orange-600" : "text-gray-700"}`}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.sub}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">예상 가스요금</p>
          <p className="text-3xl font-bold">{result.total.toLocaleString()}원</p>
          <p className="text-white/70 text-sm mt-1">VAT 포함</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">사용량 (MJ)</span>
          <span className="font-medium">{result.usageMJ.toLocaleString()} MJ</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">기본요금</span>
          <span className="font-medium">{result.baseFee.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">사용요금</span>
          <span className="font-medium">{result.usageFee.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">부가세 (10%)</span>
          <span className="font-medium">{result.vat.toLocaleString()}원</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• MJ = m³ × 43.1 (열량 환산)</p>
          <p>• 사용요금 = MJ × 단가(원/MJ)</p>
          <p>• 가스요금 = 기본요금 + 사용요금</p>
          <p>• 총 요금 = 가스요금 × 1.1 (VAT 포함)</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">서울도시가스 기준 · 지역별로 다를 수 있음</p>
      </div>
    </div>
  );
}
