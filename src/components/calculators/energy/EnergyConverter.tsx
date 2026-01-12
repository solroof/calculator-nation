"use client";

import { useState, useMemo } from "react";

const units = [
  { key: "J", name: "줄 (J)", factor: 1 },
  { key: "kJ", name: "킬로줄 (kJ)", factor: 1000 },
  { key: "MJ", name: "메가줄 (MJ)", factor: 1000000 },
  { key: "cal", name: "칼로리 (cal)", factor: 4.184 },
  { key: "kcal", name: "킬로칼로리 (kcal)", factor: 4184 },
  { key: "Wh", name: "와트시 (Wh)", factor: 3600 },
  { key: "kWh", name: "킬로와트시 (kWh)", factor: 3600000 },
  { key: "eV", name: "전자볼트 (eV)", factor: 1.602e-19 },
  { key: "BTU", name: "BTU", factor: 1055.06 },
  { key: "ft-lb", name: "피트파운드 (ft·lb)", factor: 1.35582 },
  { key: "erg", name: "에르그 (erg)", factor: 1e-7 },
];

export function EnergyConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("kWh");

  const results = useMemo(() => {
    const inputValue = parseFloat(value) || 0;
    const fromFactor = units.find((u) => u.key === fromUnit)?.factor || 1;
    const baseValue = inputValue * fromFactor;

    const newResults: Record<string, string> = {};
    units.forEach((unit) => {
      const converted = baseValue / unit.factor;
      if (converted === 0) {
        newResults[unit.key] = "0";
      } else if (Math.abs(converted) >= 1000000 || Math.abs(converted) < 0.0001) {
        newResults[unit.key] = converted.toExponential(4);
      } else {
        newResults[unit.key] = converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
      }
    });
    return newResults;
  }, [value, fromUnit]);

  return (
    <div id="energy" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">에너지 변환</h2>
          <p className="text-xs text-gray-500">J, cal, kWh, BTU 등</p>
        </div>
        <span className="text-2xl">⚡</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">값 입력</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-lg"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기준 단위</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          >
            {units.map((unit) => (
              <option key={unit.key} value={unit.key}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {units.map((unit) => (
          <div
            key={unit.key}
            className={`flex justify-between items-center p-3 rounded-xl ${
              unit.key === fromUnit ? "bg-amber-50 border-2 border-amber-200" : "bg-gray-50"
            }`}
          >
            <span className="text-sm text-gray-600">{unit.name}</span>
            <span className={`font-mono font-medium ${unit.key === fromUnit ? "text-amber-600" : "text-gray-800"}`}>
              {results[unit.key] || "0"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
