"use client";

import { useState, useEffect } from "react";

const units = [
  { key: "deg", name: "도 (°)", factor: 1 },
  { key: "rad", name: "라디안 (rad)", factor: 180 / Math.PI },
  { key: "grad", name: "그라디안 (grad)", factor: 0.9 },
  { key: "turn", name: "회전 (turn)", factor: 360 },
  { key: "arcmin", name: "분 (')", factor: 1 / 60 },
  { key: "arcsec", name: "초 (\")", factor: 1 / 3600 },
];

export function AngleConverter() {
  const [value, setValue] = useState("90");
  const [fromUnit, setFromUnit] = useState("deg");
  const [results, setResults] = useState<Record<string, string>>({});

  useEffect(() => {
    const inputValue = parseFloat(value) || 0;
    const fromFactor = units.find((u) => u.key === fromUnit)?.factor || 1;
    const baseDegrees = inputValue * fromFactor;

    const newResults: Record<string, string> = {};
    units.forEach((unit) => {
      const converted = baseDegrees / unit.factor;
      if (converted === 0) {
        newResults[unit.key] = "0";
      } else if (Math.abs(converted) >= 1000000) {
        newResults[unit.key] = converted.toExponential(4);
      } else {
        newResults[unit.key] = converted.toLocaleString(undefined, { maximumFractionDigits: 8 });
      }
    });
    setResults(newResults);
  }, [value, fromUnit]);

  // 삼각함수 값 계산
  const degrees = parseFloat(value) * (units.find((u) => u.key === fromUnit)?.factor || 1);
  const radians = (degrees * Math.PI) / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const tan = Math.abs(cos) < 1e-10 ? Infinity : Math.tan(radians);

  return (
    <div id="angle" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">각도 변환</h2>
          <p className="text-xs text-gray-500">도, 라디안, 그라디안</p>
        </div>
        <span className="text-2xl">📐</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">값 입력</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
            placeholder="90"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기준 단위</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
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
              unit.key === fromUnit ? "bg-indigo-50 border-2 border-indigo-200" : "bg-gray-50"
            }`}
          >
            <span className="text-sm text-gray-600">{unit.name}</span>
            <span className={`font-mono font-medium ${unit.key === fromUnit ? "text-indigo-600" : "text-gray-800"}`}>
              {results[unit.key] || "0"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white">
        <p className="text-white/70 text-sm mb-3">삼각함수 값 ({degrees.toFixed(2)}°)</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-white/70 text-xs">sin</p>
            <p className="font-mono font-bold">{sin.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">cos</p>
            <p className="font-mono font-bold">{cos.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">tan</p>
            <p className="font-mono font-bold">{isFinite(tan) ? tan.toFixed(6) : "∞"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
