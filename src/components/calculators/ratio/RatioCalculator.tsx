"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

export function RatioCalculator() {
  const [mode, setMode] = useState<"proportion" | "scale" | "divide">("proportion");
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(5);
  const [c, setC] = useState<number>(9);
  const [total, setTotal] = useState<number>(1000);
  const [ratio1, setRatio1] = useState<number>(2);
  const [ratio2, setRatio2] = useState<number>(3);

  const calculateProportion = () => {
    const aVal = a || 0;
    const bVal = b || 0;
    const cVal = c || 0;

    if (aVal === 0) return { result: 0, valid: false };

    // a : b = c : x  =>  x = (b * c) / a
    const result = (bVal * cVal) / aVal;
    return { result, valid: true };
  };

  const calculateScale = () => {
    const aVal = a || 0;
    const bVal = b || 0;

    if (bVal === 0) return { ratio: 0, simplified: "", valid: false };

    const ratio = aVal / bVal;

    // 최대공약수로 비율 단순화
    const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
    const g = gcd(Math.abs(aVal), Math.abs(bVal));
    const simplified = `${aVal / g} : ${bVal / g}`;

    return { ratio, simplified, valid: true };
  };

  const calculateDivide = () => {
    const totalVal = total || 0;
    const r1 = ratio1 || 0;
    const r2 = ratio2 || 0;
    const sum = r1 + r2;

    if (sum === 0) return { part1: 0, part2: 0, valid: false };

    const part1 = (totalVal * r1) / sum;
    const part2 = (totalVal * r2) / sum;

    return { part1, part2, valid: true };
  };

  return (
    <div id="ratio" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">비율 계산기</h2>
          <p className="text-xs text-gray-500">비례식, 비율, 비율 분배</p>
        </div>
        <span className="text-2xl">⚖️</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMode("proportion")}
            className={`p-2 rounded-xl border-2 text-sm transition-all ${
              mode === "proportion"
                ? "border-teal-500 bg-teal-50 text-teal-600"
                : "border-gray-200"
            }`}
          >
            비례식
          </button>
          <button
            onClick={() => setMode("scale")}
            className={`p-2 rounded-xl border-2 text-sm transition-all ${
              mode === "scale"
                ? "border-teal-500 bg-teal-50 text-teal-600"
                : "border-gray-200"
            }`}
          >
            비율 계산
          </button>
          <button
            onClick={() => setMode("divide")}
            className={`p-2 rounded-xl border-2 text-sm transition-all ${
              mode === "divide"
                ? "border-teal-500 bg-teal-50 text-teal-600"
                : "border-gray-200"
            }`}
          >
            비율 분배
          </button>
        </div>

        {mode === "proportion" && (
          <>
            <div className="p-3 bg-teal-50 rounded-xl text-center">
              <span className="font-mono text-lg">
                {a} : {b} = {c} : <span className="text-teal-600 font-bold">?</span>
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <NumberInput
                value={a}
                onChange={setA}
                min={0}
                step={1}
                format="none"
              />
              <span className="text-center text-gray-500">:</span>
              <NumberInput
                value={b}
                onChange={setB}
                min={0}
                step={1}
                format="none"
              />
              <span className="text-center text-gray-500">=</span>
            </div>
            <div className="grid grid-cols-4 gap-2 items-center">
              <NumberInput
                value={c}
                onChange={setC}
                min={0}
                step={1}
                format="none"
              />
              <span className="text-center text-gray-500">:</span>
              <div className="px-3 py-2 bg-teal-100 rounded-xl text-center font-bold text-teal-600">
                {calculateProportion().valid ? calculateProportion().result.toFixed(4) : "-"}
              </div>
              <span></span>
            </div>
          </>
        )}

        {mode === "scale" && (
          <>
            <div className="grid grid-cols-3 gap-2 items-center">
              <NumberInput
                value={a}
                onChange={setA}
                min={0}
                step={1}
                format="none"
              />
              <span className="text-center text-gray-500">:</span>
              <NumberInput
                value={b}
                onChange={setB}
                min={0}
                step={1}
                format="none"
              />
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white text-center">
              <p className="text-white/70 text-sm">비율</p>
              <p className="text-2xl font-bold">{calculateScale().simplified}</p>
              <p className="text-white/70 text-sm mt-2">
                = {calculateScale().ratio?.toFixed(4)}
              </p>
            </div>
          </>
        )}

        {mode === "divide" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전체 값</label>
              <NumberInput
                value={total}
                onChange={setTotal}
                min={0}
                step={1}
                format="comma"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <NumberInput
                value={ratio1}
                onChange={setRatio1}
                min={0}
                step={1}
                format="none"
              />
              <span className="text-center text-gray-500">:</span>
              <NumberInput
                value={ratio2}
                onChange={setRatio2}
                min={0}
                step={1}
                format="none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-teal-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-xs mb-1">첫번째 몫</p>
                <p className="text-xl font-bold text-teal-600">
                  {calculateDivide().part1?.toFixed(2)}
                </p>
              </div>
              <div className="bg-teal-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-xs mb-1">두번째 몫</p>
                <p className="text-xl font-bold text-teal-600">
                  {calculateDivide().part2?.toFixed(2)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 비례식: a : b = c : x → x = (b × c) / a</p>
          <p>• 비율: a : b = a/b (최대공약수로 기약분수)</p>
          <p>• 비율 분배: 전체 × (비율 / 비율합)</p>
        </div>
      </div>
    </div>
  );
}
