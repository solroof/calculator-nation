"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

export function QuadraticCalculator() {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-5);
  const [c, setC] = useState<number>(6);

  const calculate = () => {
    const aVal = a || 0;
    const bVal = b || 0;
    const cVal = c || 0;

    if (aVal === 0) {
      // 일차방정식
      if (bVal === 0) {
        return { type: "invalid", message: "a와 b가 모두 0입니다" };
      }
      const x = -cVal / bVal;
      return { type: "linear", x1: x, x2: null };
    }

    // 판별식
    const discriminant = bVal * bVal - 4 * aVal * cVal;

    if (discriminant > 0) {
      // 서로 다른 두 실근
      const x1 = (-bVal + Math.sqrt(discriminant)) / (2 * aVal);
      const x2 = (-bVal - Math.sqrt(discriminant)) / (2 * aVal);
      return { type: "twoRoots", x1, x2, discriminant };
    } else if (discriminant === 0) {
      // 중근
      const x = -bVal / (2 * aVal);
      return { type: "oneRoot", x1: x, x2: x, discriminant };
    } else {
      // 허근
      const realPart = -bVal / (2 * aVal);
      const imagPart = Math.sqrt(-discriminant) / (2 * aVal);
      return { type: "complex", realPart, imagPart, discriminant };
    }
  };

  const result = calculate();

  // 방정식 문자열 생성
  const getEquation = () => {
    const aVal = a || 0;
    const bVal = b || 0;
    const cVal = c || 0;

    let eq = "";
    if (aVal !== 0) eq += `${aVal === 1 ? "" : aVal === -1 ? "-" : aVal}x²`;
    if (bVal !== 0) {
      if (eq) eq += bVal > 0 ? " + " : " - ";
      eq += `${Math.abs(bVal) === 1 ? "" : Math.abs(bVal)}x`;
    }
    if (cVal !== 0) {
      if (eq) eq += cVal > 0 ? " + " : " - ";
      eq += Math.abs(cVal);
    }
    return eq + " = 0";
  };

  return (
    <div id="quadratic" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">이차방정식 계산기</h2>
          <p className="text-xs text-gray-500">ax² + bx + c = 0</p>
        </div>
        <span className="text-2xl">📝</span>
      </div>

      <div className="p-3 bg-indigo-50 rounded-xl mb-4">
        <p className="text-center font-mono text-lg text-indigo-800">{getEquation()}</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">a (x²의 계수)</label>
            <NumberInput
              value={a}
              onChange={setA}
              step={1}
              format="none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">b (x의 계수)</label>
            <NumberInput
              value={b}
              onChange={setB}
              step={1}
              format="none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">c (상수항)</label>
            <NumberInput
              value={c}
              onChange={setC}
              step={1}
              format="none"
            />
          </div>
        </div>
      </div>

      <div className={`mt-6 rounded-xl p-5 text-white ${
        result.type === "complex"
          ? "bg-gradient-to-br from-purple-500 to-purple-600"
          : "bg-gradient-to-br from-indigo-500 to-indigo-600"
      }`}>
        <p className="text-white/70 text-sm mb-2 text-center">해 (Solutions)</p>

        {result.type === "invalid" ? (
          <p className="text-xl font-bold text-center">{result.message}</p>
        ) : result.type === "linear" ? (
          <p className="text-2xl font-bold text-center">x = {result.x1?.toFixed(6)}</p>
        ) : result.type === "twoRoots" ? (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-white/70 text-xs">x₁</p>
              <p className="text-xl font-bold">{result.x1?.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">x₂</p>
              <p className="text-xl font-bold">{result.x2?.toFixed(6)}</p>
            </div>
          </div>
        ) : result.type === "oneRoot" ? (
          <div className="text-center">
            <p className="text-2xl font-bold">x = {result.x1?.toFixed(6)}</p>
            <p className="text-white/70 text-sm mt-1">(중근)</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-bold">
              x = {result.realPart?.toFixed(4)} ± {result.imagPart?.toFixed(4)}i
            </p>
            <p className="text-white/70 text-sm mt-1">(허근)</p>
          </div>
        )}
      </div>

      {"discriminant" in result && (
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            판별식 D = b² - 4ac = {result.discriminant?.toFixed(4)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {result.discriminant! > 0 && "D > 0: 서로 다른 두 실근"}
            {result.discriminant === 0 && "D = 0: 중근 (같은 두 실근)"}
            {result.discriminant! < 0 && "D < 0: 허근 (복소수 근)"}
          </p>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 근의 공식: x = (-b ± √(b²-4ac)) / 2a</p>
          <p>• 판별식: D = b² - 4ac</p>
          <p>• D &gt; 0: 서로 다른 두 실근</p>
          <p>• D = 0: 중근 (x = -b/2a)</p>
          <p>• D &lt; 0: 허근 (복소수)</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">근과 계수의 관계</p>
          <p>• 두 근의 합: x₁ + x₂ = -b/a</p>
          <p>• 두 근의 곱: x₁ × x₂ = c/a</p>
        </div>
      </div>
    </div>
  );
}
