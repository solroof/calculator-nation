"use client";

import { useState } from "react";

type Unit = "mm" | "cm" | "m" | "km" | "inch" | "ft" | "yard" | "mile";

const units: { key: Unit; label: string; toMeter: number }[] = [
  { key: "mm", label: "밀리미터 (mm)", toMeter: 0.001 },
  { key: "cm", label: "센티미터 (cm)", toMeter: 0.01 },
  { key: "m", label: "미터 (m)", toMeter: 1 },
  { key: "km", label: "킬로미터 (km)", toMeter: 1000 },
  { key: "inch", label: "인치 (inch)", toMeter: 0.0254 },
  { key: "ft", label: "피트 (ft)", toMeter: 0.3048 },
  { key: "yard", label: "야드 (yard)", toMeter: 0.9144 },
  { key: "mile", label: "마일 (mile)", toMeter: 1609.344 },
];

export function LengthCalculator() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState<Unit>("m");
  const [toUnit, setToUnit] = useState<Unit>("cm");

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return 0;

    const fromData = units.find((u) => u.key === fromUnit);
    const toData = units.find((u) => u.key === toUnit);

    if (!fromData || !toData) return 0;

    const meters = num * fromData.toMeter;
    return meters / toData.toMeter;
  };

  const result = convert();

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div id="length" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">길이 변환</h2>
          <p className="text-xs text-gray-500">단위 간 길이 변환</p>
        </div>
        <span className="text-2xl">📏</span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">값 입력</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 text-lg"
            placeholder="변환할 값"
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
    </div>
  );
}
