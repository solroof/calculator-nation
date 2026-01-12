"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

type Unit = "mg" | "g" | "kg" | "ton" | "oz" | "lb" | "stone";

const units: { key: Unit; label: string; toKg: number }[] = [
  { key: "mg", label: "밀리그램 (mg)", toKg: 0.000001 },
  { key: "g", label: "그램 (g)", toKg: 0.001 },
  { key: "kg", label: "킬로그램 (kg)", toKg: 1 },
  { key: "ton", label: "톤 (ton)", toKg: 1000 },
  { key: "oz", label: "온스 (oz)", toKg: 0.0283495 },
  { key: "lb", label: "파운드 (lb)", toKg: 0.453592 },
  { key: "stone", label: "스톤 (stone)", toKg: 6.35029 },
];

export function WeightCalculator() {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<Unit>("kg");
  const [toUnit, setToUnit] = useState<Unit>("lb");

  const convert = () => {
    const num = value || 0;

    const fromData = units.find((u) => u.key === fromUnit);
    const toData = units.find((u) => u.key === toUnit);

    if (!fromData || !toData) return 0;

    const kg = num * fromData.toKg;
    return kg / toData.toKg;
  };

  const result = convert();

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div id="weight" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">무게 변환</h2>
          <p className="text-xs text-gray-500">단위 간 무게 변환</p>
        </div>
        <span className="text-2xl">⚖️</span>
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
          <span className="text-lg ml-2 font-normal opacity-80">{toUnit}</span>
        </p>
        <p className="text-white/70 text-sm mt-2">
          {value} {fromUnit} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toUnit}
        </p>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">변환 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 결과 = 입력값 × (기준단위 비율 / 변환단위 비율)</p>
          <p>• 기준 단위: 킬로그램 (kg)</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">주요 변환 비율</p>
          <p>1 kg = 2.205 lb | 1 lb = 453.6 g</p>
          <p>1 oz = 28.35 g | 1 ton = 1,000 kg</p>
        </div>
      </div>
    </div>
  );
}
