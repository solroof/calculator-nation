"use client";

import { useState, useEffect } from "react";

const units = [
  { key: "Pa", name: "파스칼 (Pa)", factor: 1 },
  { key: "kPa", name: "킬로파스칼 (kPa)", factor: 1000 },
  { key: "MPa", name: "메가파스칼 (MPa)", factor: 1000000 },
  { key: "bar", name: "바 (bar)", factor: 100000 },
  { key: "mbar", name: "밀리바 (mbar)", factor: 100 },
  { key: "atm", name: "기압 (atm)", factor: 101325 },
  { key: "psi", name: "PSI", factor: 6894.76 },
  { key: "mmHg", name: "수은주밀리미터 (mmHg)", factor: 133.322 },
  { key: "inHg", name: "수은주인치 (inHg)", factor: 3386.39 },
  { key: "torr", name: "토르 (Torr)", factor: 133.322 },
  { key: "kgf/cm2", name: "kgf/cm²", factor: 98066.5 },
];

export function PressureConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("atm");
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
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
    setResults(newResults);
  }, [value, fromUnit]);

  return (
    <div id="pressure" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">압력 변환</h2>
          <p className="text-xs text-gray-500">Pa, bar, atm, psi 등</p>
        </div>
        <span className="text-2xl">🎈</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">값 입력</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 text-lg"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기준 단위</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
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
              unit.key === fromUnit ? "bg-cyan-50 border-2 border-cyan-200" : "bg-gray-50"
            }`}
          >
            <span className="text-sm text-gray-600">{unit.name}</span>
            <span className={`font-mono font-medium ${unit.key === fromUnit ? "text-cyan-600" : "text-gray-800"}`}>
              {results[unit.key] || "0"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
