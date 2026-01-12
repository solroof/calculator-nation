"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

type Unit = "mps" | "kmph" | "mph" | "knot" | "mach";

const units: { key: Unit; label: string; toMps: number }[] = [
  { key: "mps", label: "m/s (초속)", toMps: 1 },
  { key: "kmph", label: "km/h (시속)", toMps: 0.277778 },
  { key: "mph", label: "mph (마일/시)", toMps: 0.44704 },
  { key: "knot", label: "knot (노트)", toMps: 0.514444 },
  { key: "mach", label: "Mach (마하)", toMps: 343 },
];

export function SpeedCalculator() {
  const [value, setValue] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<Unit>("kmph");
  const [toUnit, setToUnit] = useState<Unit>("mph");

  const convert = () => {
    const num = value || 0;

    const fromData = units.find((u) => u.key === fromUnit);
    const toData = units.find((u) => u.key === toUnit);

    if (!fromData || !toData) return 0;

    const mps = num * fromData.toMps;
    return mps / toData.toMps;
  };

  const result = convert();

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div id="speed" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">속도 변환</h2>
          <p className="text-xs text-gray-500">단위 간 속도 변환</p>
        </div>
        <span className="text-2xl">🚗</span>
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
          {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          <span className="text-lg ml-2 font-normal opacity-80">{toUnit}</span>
        </p>
        <p className="text-white/70 text-sm mt-2">
          {value} {fromUnit} = {result.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toUnit}
        </p>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">변환 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 결과 = 입력값 × (기준단위 비율 / 변환단위 비율)</p>
          <p>• 기준 단위: m/s (초속)</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">주요 변환 비율</p>
          <p>1 km/h = 0.278 m/s | 1 mph = 1.609 km/h</p>
          <p>1 knot = 1.852 km/h | 1 Mach ≈ 343 m/s</p>
        </div>
      </div>
    </div>
  );
}
