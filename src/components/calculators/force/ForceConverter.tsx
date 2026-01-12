"use client";

import { useState, useMemo } from "react";

const units = [
  { key: "N", name: "뉴턴 (N)", factor: 1 },
  { key: "kN", name: "킬로뉴턴 (kN)", factor: 1000 },
  { key: "MN", name: "메가뉴턴 (MN)", factor: 1000000 },
  { key: "dyn", name: "다인 (dyn)", factor: 0.00001 },
  { key: "kgf", name: "킬로그램힘 (kgf)", factor: 9.80665 },
  { key: "gf", name: "그램힘 (gf)", factor: 0.00980665 },
  { key: "tf", name: "톤힘 (tf)", factor: 9806.65 },
  { key: "lbf", name: "파운드힘 (lbf)", factor: 4.44822 },
  { key: "ozf", name: "온스힘 (ozf)", factor: 0.278014 },
  { key: "pdl", name: "파운달 (pdl)", factor: 0.138255 },
  { key: "kip", name: "킵 (kip)", factor: 4448.22 },
];

export function ForceConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("kgf");

  const results = useMemo(() => {
    const inputValue = parseFloat(value) || 0;
    const fromFactor = units.find((u) => u.key === fromUnit)?.factor || 1;
    const baseN = inputValue * fromFactor;

    const newResults: Record<string, string> = {};
    units.forEach((unit) => {
      const converted = baseN / unit.factor;
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
    <div id="force" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">힘 변환</h2>
          <p className="text-xs text-gray-500">N, kgf, lbf 등</p>
        </div>
        <span className="text-2xl">💪</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">값 입력</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 text-lg"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기준 단위</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
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
              unit.key === fromUnit ? "bg-rose-50 border-2 border-rose-200" : "bg-gray-50"
            }`}
          >
            <span className="text-sm text-gray-600">{unit.name}</span>
            <span className={`font-mono font-medium ${unit.key === fromUnit ? "text-rose-600" : "text-gray-800"}`}>
              {results[unit.key] || "0"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-rose-50 rounded-xl">
        <p className="text-sm font-medium text-rose-800 mb-1">참고</p>
        <div className="text-xs text-gray-600">
          <p>1 kgf = 9.80665 N (중력가속도 기준)</p>
          <p>1 lbf ≈ 4.448 N</p>
        </div>
      </div>
    </div>
  );
}
