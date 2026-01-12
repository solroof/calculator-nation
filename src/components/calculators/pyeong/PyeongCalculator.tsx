"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

const PYEONG_TO_SQM = 3.305785;

export function PyeongCalculator() {
  const [pyeong, setPyeong] = useState<number>(30);
  const [sqm, setSqm] = useState<number>(99.17);

  const handlePyeongChange = (value: number) => {
    setPyeong(value);
    if (value > 0) {
      setSqm(parseFloat((value * PYEONG_TO_SQM).toFixed(2)));
    }
  };

  const handleSqmChange = (value: number) => {
    setSqm(value);
    if (value > 0) {
      setPyeong(parseFloat((value / PYEONG_TO_SQM).toFixed(2)));
    }
  };

  const quickValues = [10, 20, 30, 40, 50, 60];

  return (
    <div id="pyeong" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">평수 변환</h2>
          <p className="text-xs text-gray-500">평 ↔ 제곱미터(㎡) 변환</p>
        </div>
        <span className="text-2xl">📏</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">빠른 선택 (평)</p>
        <div className="flex flex-wrap gap-2">
          {quickValues.map((val) => (
            <button
              key={val}
              onClick={() => handlePyeongChange(val)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                pyeong === val
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {val}평
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">평</label>
          <NumberInput
            value={pyeong}
            onChange={handlePyeongChange}
            min={0}
            step={1}
            format="comma"
            suffix="평"
          />
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-full p-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제곱미터</label>
          <NumberInput
            value={sqm}
            onChange={handleSqmChange}
            min={0}
            step={1}
            format="comma"
            suffix="㎡"
          />
        </div>
      </div>

      {(pyeong > 0 || sqm > 0) && (
        <div className="mt-6 bg-emerald-50 rounded-xl p-4">
          <p className="text-sm text-emerald-700">
            <strong>{pyeong || 0}평</strong>은 <strong>{sqm || 0}㎡</strong>입니다.
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            (1평 = {PYEONG_TO_SQM}㎡)
          </p>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 1평 = 3.305785㎡</p>
          <p>• 평 → ㎡: 평수 × 3.305785</p>
          <p>• ㎡ → 평: ㎡ ÷ 3.305785</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">참고</p>
          <p>• 아파트 전용면적 기준</p>
          <p>• 공급면적 = 전용면적 + 공용면적</p>
        </div>
      </div>
    </div>
  );
}
