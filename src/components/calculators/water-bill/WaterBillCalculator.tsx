"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

// 서울시 상수도 요금 (2024년 기준, 가정용)
const waterRates = [
  { min: 0, max: 30, rate: 360 },
  { min: 30, max: 50, rate: 550 },
  { min: 50, max: Infinity, rate: 790 },
];

const sewageRate = 0.5; // 하수도 요금 (상수도의 약 50%)

export function WaterBillCalculator() {
  const [usage, setUsage] = useState<number>(20);
  const [diameter, setDiameter] = useState("15");

  // 구경별 기본요금
  const baseFees: Record<string, number> = {
    "15": 1080,
    "20": 2850,
    "25": 5070,
    "32": 9450,
    "40": 16650,
    "50": 27000,
  };

  const calculate = () => {
    const usageValue = usage || 0;
    const baseFee = baseFees[diameter] || 1080;

    // 누진제 적용 상수도 요금
    let waterFee = 0;
    let remaining = usageValue;

    for (const tier of waterRates) {
      if (remaining <= 0) break;
      const tierUsage = Math.min(remaining, tier.max - tier.min);
      waterFee += tierUsage * tier.rate;
      remaining -= tierUsage;
    }

    // 하수도 요금
    const sewageFee = waterFee * sewageRate;

    // 물이용부담금 (톤당 170원)
    const waterUsageFee = usageValue * 170;

    const subtotal = baseFee + waterFee + sewageFee + waterUsageFee;
    const vat = subtotal * 0.1;
    const total = subtotal + vat;

    return {
      baseFee,
      waterFee: Math.round(waterFee),
      sewageFee: Math.round(sewageFee),
      waterUsageFee: Math.round(waterUsageFee),
      subtotal: Math.round(subtotal),
      vat: Math.round(vat),
      total: Math.round(total),
      perTon: usageValue > 0 ? Math.round(total / usageValue) : 0,
    };
  };

  const result = calculate();

  return (
    <div id="water-bill" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">수도요금 계산기</h2>
          <p className="text-xs text-gray-500">상하수도 요금 계산</p>
        </div>
        <span className="text-2xl">🚿</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">사용량 (m³/톤)</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">계량기 구경 (mm)</label>
          <select
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
          >
            <option value="15">15mm (일반 가정)</option>
            <option value="20">20mm</option>
            <option value="25">25mm</option>
            <option value="32">32mm</option>
            <option value="40">40mm</option>
            <option value="50">50mm</option>
          </select>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-5 text-white">
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">예상 수도요금</p>
          <p className="text-3xl font-bold">{result.total.toLocaleString()}원</p>
          <p className="text-white/70 text-sm mt-1">톤당 {result.perTon.toLocaleString()}원</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">기본요금</span>
          <span className="font-medium">{result.baseFee.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">상수도 요금</span>
          <span className="font-medium">{result.waterFee.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">하수도 요금</span>
          <span className="font-medium">{result.sewageFee.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">물이용부담금</span>
          <span className="font-medium">{result.waterUsageFee.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">부가세 (10%)</span>
          <span className="font-medium">{result.vat.toLocaleString()}원</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-cyan-50 rounded-xl">
        <p className="text-sm font-medium text-cyan-800 mb-1">누진제 구간</p>
        <div className="text-xs text-gray-600">
          <p>1~30톤: 360원/톤 | 31~50톤: 550원/톤 | 51톤~: 790원/톤</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 상수도 요금 = 누진제 구간별 요금 합계</p>
          <p>• 하수도 요금 = 상수도 요금 × 50%</p>
          <p>• 물이용부담금 = 사용량 × 170원/톤</p>
          <p>• 총 요금 = (기본요금 + 상수도 + 하수도 + 물이용부담금) × 1.1</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">누진제 구간 (서울시)</p>
          <p>1~30톤: 360원 | 31~50톤: 550원 | 51톤~: 790원</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">서울시 수도요금표 기준</p>
      </div>
    </div>
  );
}
