"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

type Unit = "bit" | "byte" | "kb" | "mb" | "gb" | "tb" | "pb";

const units: { key: Unit; label: string; toByte: number }[] = [
  { key: "bit", label: "비트 (bit)", toByte: 0.125 },
  { key: "byte", label: "바이트 (B)", toByte: 1 },
  { key: "kb", label: "킬로바이트 (KB)", toByte: 1024 },
  { key: "mb", label: "메가바이트 (MB)", toByte: 1024 * 1024 },
  { key: "gb", label: "기가바이트 (GB)", toByte: 1024 * 1024 * 1024 },
  { key: "tb", label: "테라바이트 (TB)", toByte: 1024 * 1024 * 1024 * 1024 },
  { key: "pb", label: "페타바이트 (PB)", toByte: 1024 * 1024 * 1024 * 1024 * 1024 },
];

export function DataSizeCalculator() {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<Unit>("gb");
  const [toUnit, setToUnit] = useState<Unit>("mb");

  const convert = () => {
    const num = value || 0;

    const fromData = units.find((u) => u.key === fromUnit);
    const toData = units.find((u) => u.key === toUnit);

    if (!fromData || !toData) return 0;

    const bytes = num * fromData.toByte;
    return bytes / toData.toByte;
  };

  const result = convert();

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div id="data-size" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">데이터 용량 변환</h2>
          <p className="text-xs text-gray-500">디지털 저장 단위 변환</p>
        </div>
        <span className="text-2xl">💾</span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">값 입력</label>
          <NumberInput
            value={value}
            onChange={setValue}
            min={0}
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
          <span className="text-lg ml-2 font-normal opacity-80">{toUnit.toUpperCase()}</span>
        </p>
        <p className="text-white/70 text-sm mt-2">
          {value} {fromUnit.toUpperCase()} = {result.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toUnit.toUpperCase()}
        </p>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">변환 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 결과 = 입력값 × (기준단위 비율 / 변환단위 비율)</p>
          <p>• 기준 단위: 바이트 (Byte)</p>
          <p>• 8 bit = 1 Byte</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">2진법 단위 (1024 기준)</p>
          <p>1 KB = 1,024 B | 1 MB = 1,024 KB</p>
          <p>1 GB = 1,024 MB | 1 TB = 1,024 GB</p>
        </div>
      </div>
    </div>
  );
}
