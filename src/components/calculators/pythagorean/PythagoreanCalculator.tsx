"use client";

import { useState } from "react";

type CalcMode = "findC" | "findA" | "check";

export function PythagoreanCalculator() {
  const [mode, setMode] = useState<CalcMode>("findC");
  const [sideA, setSideA] = useState("3");
  const [sideB, setSideB] = useState("4");
  const [sideC, setSideC] = useState("5");

  const calculate = () => {
    const a = parseFloat(sideA) || 0;
    const b = parseFloat(sideB) || 0;
    const c = parseFloat(sideC) || 0;

    switch (mode) {
      case "findC": {
        // c = √(a² + b²)
        const result = Math.sqrt(a * a + b * b);
        return {
          result,
          formula: `c = √(${a}² + ${b}²) = √${a * a + b * b}`,
          isValid: a > 0 && b > 0,
        };
      }
      case "findA": {
        // a = √(c² - b²)
        const cSquared = c * c;
        const bSquared = b * b;
        if (cSquared < bSquared) {
          return { result: NaN, formula: "빗변이 다른 변보다 커야 합니다", isValid: false };
        }
        const result = Math.sqrt(cSquared - bSquared);
        return {
          result,
          formula: `a = √(${c}² - ${b}²) = √${cSquared - bSquared}`,
          isValid: c > b && b > 0,
        };
      }
      case "check": {
        // a² + b² = c² 검증
        const aSquared = a * a;
        const bSquared = b * b;
        const cSquared = c * c;
        const sum = aSquared + bSquared;
        const diff = Math.abs(sum - cSquared);
        const isRightTriangle = diff < 0.0001;
        return {
          result: isRightTriangle ? 1 : 0,
          formula: `${a}² + ${b}² = ${aSquared + bSquared}, ${c}² = ${cSquared}`,
          isValid: true,
          isRightTriangle,
          aSquared,
          bSquared,
          cSquared,
        };
      }
    }
  };

  const result = calculate();

  return (
    <div id="pythagorean" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">피타고라스 정리</h2>
          <p className="text-xs text-gray-500">a² + b² = c²</p>
        </div>
        <span className="text-2xl">📐</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">계산 유형</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setMode("findC")}
              className={`p-2 rounded-xl border-2 text-sm transition-all ${
                mode === "findC"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                  : "border-gray-200"
              }`}
            >
              빗변 (c) 구하기
            </button>
            <button
              onClick={() => setMode("findA")}
              className={`p-2 rounded-xl border-2 text-sm transition-all ${
                mode === "findA"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                  : "border-gray-200"
              }`}
            >
              밑변 (a) 구하기
            </button>
            <button
              onClick={() => setMode("check")}
              className={`p-2 rounded-xl border-2 text-sm transition-all ${
                mode === "check"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                  : "border-gray-200"
              }`}
            >
              직각 확인
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              a {mode === "findA" ? "(결과)" : ""}
            </label>
            <input
              type="number"
              value={sideA}
              onChange={(e) => setSideA(e.target.value)}
              disabled={mode === "findA"}
              className={`w-full px-3 py-2 border border-gray-200 rounded-xl text-center ${
                mode === "findA" ? "bg-gray-100" : "focus:ring-2 focus:ring-indigo-500"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">b</label>
            <input
              type="number"
              value={sideB}
              onChange={(e) => setSideB(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              c (빗변) {mode === "findC" ? "(결과)" : ""}
            </label>
            <input
              type="number"
              value={sideC}
              onChange={(e) => setSideC(e.target.value)}
              disabled={mode === "findC"}
              className={`w-full px-3 py-2 border border-gray-200 rounded-xl text-center ${
                mode === "findC" ? "bg-gray-100" : "focus:ring-2 focus:ring-indigo-500"
              }`}
            />
          </div>
        </div>
      </div>

      <div className={`mt-6 rounded-xl p-5 text-white ${
        mode === "check"
          ? result.result === 1
            ? "bg-gradient-to-br from-green-500 to-green-600"
            : "bg-gradient-to-br from-red-500 to-red-600"
          : "bg-gradient-to-br from-indigo-500 to-indigo-600"
      }`}>
        <div className="text-center">
          {mode === "check" ? (
            <>
              <p className="text-white/70 text-sm mb-1">직각삼각형 확인</p>
              <p className="text-2xl font-bold">
                {result.result === 1 ? "✓ 직각삼각형입니다" : "✗ 직각삼각형이 아닙니다"}
              </p>
            </>
          ) : (
            <>
              <p className="text-white/70 text-sm mb-1">
                {mode === "findC" ? "빗변 (c)" : "밑변 (a)"}
              </p>
              <p className="text-3xl font-bold">
                {result.isValid ? result.result.toFixed(6) : "계산 불가"}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600 mb-2">계산식</p>
        <p className="font-mono text-sm">{result.formula}</p>
      </div>

      {/* 삼각형 시각화 */}
      <div className="mt-4 flex justify-center">
        <svg viewBox="0 0 200 150" className="w-48 h-36">
          <polygon
            points="20,130 180,130 180,30"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          />
          <rect x="170" y="120" width="10" height="10" fill="none" stroke="#6366f1" />
          <text x="100" y="145" textAnchor="middle" className="text-xs fill-gray-600">a</text>
          <text x="190" y="85" textAnchor="middle" className="text-xs fill-gray-600">b</text>
          <text x="90" y="75" textAnchor="middle" className="text-xs fill-gray-600">c</text>
        </svg>
      </div>
    </div>
  );
}
