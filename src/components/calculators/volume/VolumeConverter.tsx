"use client";

import { useState, useMemo } from "react";

const units = [
  { key: "ml", name: "밀리리터 (mL)", factor: 1 },
  { key: "L", name: "리터 (L)", factor: 1000 },
  { key: "cc", name: "시시 (cc)", factor: 1 },
  { key: "m3", name: "세제곱미터 (m³)", factor: 1000000 },
  { key: "tsp", name: "티스푼 (tsp)", factor: 4.929 },
  { key: "tbsp", name: "테이블스푼 (tbsp)", factor: 14.787 },
  { key: "cup", name: "컵 (cup, US)", factor: 236.588 },
  { key: "cup_kr", name: "컵 (한국, 200mL)", factor: 200 },
  { key: "fl_oz", name: "액량 온스 (fl oz)", factor: 29.574 },
  { key: "pt", name: "파인트 (pt, US)", factor: 473.176 },
  { key: "qt", name: "쿼트 (qt, US)", factor: 946.353 },
  { key: "gal", name: "갤런 (gal, US)", factor: 3785.41 },
  { key: "gal_uk", name: "갤런 (UK)", factor: 4546.09 },
];

export function VolumeConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("L");

  const results = useMemo(() => {
    const inputValue = parseFloat(value) || 0;
    const fromFactor = units.find((u) => u.key === fromUnit)?.factor || 1;
    const baseMl = inputValue * fromFactor;

    const newResults: Record<string, string> = {};
    units.forEach((unit) => {
      const converted = baseMl / unit.factor;
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
    <div id="volume" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">부피 변환</h2>
          <p className="text-xs text-gray-500">L, mL, 컵, 갤런 등</p>
        </div>
        <span className="text-2xl">🫗</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">값 입력</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기준 단위</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
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
              unit.key === fromUnit ? "bg-blue-50 border-2 border-blue-200" : "bg-gray-50"
            }`}
          >
            <span className="text-sm text-gray-600">{unit.name}</span>
            <span className={`font-mono font-medium ${unit.key === fromUnit ? "text-blue-600" : "text-gray-800"}`}>
              {results[unit.key] || "0"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl">
        <p className="text-sm font-medium text-blue-800 mb-1">요리 팁</p>
        <div className="text-xs text-gray-600">
          <p>1컵(한국) = 200mL | 1컵(US) ≈ 237mL</p>
          <p>1큰술 = 15mL | 1작은술 = 5mL</p>
        </div>
      </div>
    </div>
  );
}
