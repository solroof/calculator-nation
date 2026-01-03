"use client";

import { useState } from "react";

type CalcMode = "radius" | "diameter" | "area" | "circumference";

export function CircleCalculator() {
  const [mode, setMode] = useState<CalcMode>("radius");
  const [value, setValue] = useState("10");

  const calculate = () => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return null;

    let radius: number;

    switch (mode) {
      case "radius":
        radius = num;
        break;
      case "diameter":
        radius = num / 2;
        break;
      case "area":
        radius = Math.sqrt(num / Math.PI);
        break;
      case "circumference":
        radius = num / (2 * Math.PI);
        break;
      default:
        return null;
    }

    return {
      radius,
      diameter: radius * 2,
      area: Math.PI * radius * radius,
      circumference: 2 * Math.PI * radius,
    };
  };

  const result = calculate();

  const modes = [
    { key: "radius", label: "반지름", unit: "" },
    { key: "diameter", label: "지름", unit: "" },
    { key: "area", label: "넓이", unit: "²" },
    { key: "circumference", label: "둘레", unit: "" },
  ];

  return (
    <div id="circle" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">원 계산기</h2>
          <p className="text-xs text-gray-500">원의 넓이, 둘레, 반지름 계산</p>
        </div>
        <span className="text-2xl">⭕</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">알고 있는 값 선택</p>
        <div className="grid grid-cols-4 gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as CalcMode)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m.key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {modes.find((m) => m.key === mode)?.label} 입력
            {mode === "area" && " (단위²)"}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
            placeholder="값 입력"
            min="0"
            step="any"
          />
        </div>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-3">계산 결과</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/70 text-xs">반지름</p>
              <p className="text-xl font-bold">{result.radius.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">지름</p>
              <p className="text-xl font-bold">{result.diameter.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">넓이</p>
              <p className="text-xl font-bold">{result.area.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">둘레</p>
              <p className="text-xl font-bold">{result.circumference.toFixed(4)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>넓이 = π × r²</p>
          <p>둘레 = 2 × π × r</p>
          <p>π (파이) ≈ 3.14159...</p>
        </div>
      </div>
    </div>
  );
}
