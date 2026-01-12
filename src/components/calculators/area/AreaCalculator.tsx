"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

type Unit = "sqmm" | "sqcm" | "sqm" | "are" | "hectare" | "sqkm" | "pyeong" | "sqft" | "sqyard" | "acre";

const units: { key: Unit; label: string; toSqm: number }[] = [
  { key: "sqmm", label: "제곱밀리미터 (mm²)", toSqm: 0.000001 },
  { key: "sqcm", label: "제곱센티미터 (cm²)", toSqm: 0.0001 },
  { key: "sqm", label: "제곱미터 (m²)", toSqm: 1 },
  { key: "are", label: "아르 (a)", toSqm: 100 },
  { key: "hectare", label: "헥타르 (ha)", toSqm: 10000 },
  { key: "sqkm", label: "제곱킬로미터 (km²)", toSqm: 1000000 },
  { key: "pyeong", label: "평 (坪)", toSqm: 3.305785 },
  { key: "sqft", label: "제곱피트 (ft²)", toSqm: 0.092903 },
  { key: "sqyard", label: "제곱야드 (yd²)", toSqm: 0.836127 },
  { key: "acre", label: "에이커 (acre)", toSqm: 4046.86 },
];

export function AreaCalculator() {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<Unit>("sqm");
  const [toUnit, setToUnit] = useState<Unit>("pyeong");

  const convert = () => {
    const num = value || 0;

    const fromData = units.find((u) => u.key === fromUnit);
    const toData = units.find((u) => u.key === toUnit);

    if (!fromData || !toData) return 0;

    const sqm = num * fromData.toSqm;
    return sqm / toData.toSqm;
  };

  const result = convert();

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div id="area" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">넓이 변환</h2>
          <p className="text-xs text-gray-500">단위 간 넓이 변환</p>
        </div>
        <span className="text-2xl">⬜</span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">값 입력</label>
          <NumberInput
            value={value}
            onChange={setValue}
            step={1}
            format="comma"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">변환 전</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as Unit)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
            >
              {units.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={swapUnits}
            className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors mb-0.5"
          >
            🔄
          </button>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">변환 후</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as Unit)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
            >
              {units.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-5 text-white">
        <p className="text-white/80 text-sm mb-1">변환 결과</p>
        <p className="text-3xl font-bold">
          {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          <span className="text-lg ml-2 font-normal opacity-80">
            {units.find(u => u.key === toUnit)?.label.split(" ")[0]}
          </span>
        </p>
        <p className="text-white/70 text-sm mt-2">
          {value} {fromUnit} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toUnit}
        </p>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">변환 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 결과 = 입력값 × (기준단위 비율 / 변환단위 비율)</p>
          <p>• 기준 단위: 제곱미터 (m²)</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">주요 변환 비율</p>
          <p>1 평 = 3.306 m² | 1 ha = 10,000 m²</p>
          <p>1 acre = 4,047 m² | 1 ft² = 0.093 m²</p>
        </div>
      </div>
    </div>
  );
}
