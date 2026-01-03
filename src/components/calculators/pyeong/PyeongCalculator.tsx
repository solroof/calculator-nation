"use client";

import { useState, useEffect } from "react";

const PYEONG_TO_SQM = 3.305785;

export function PyeongCalculator() {
  const [pyeong, setPyeong] = useState("");
  const [sqm, setSqm] = useState("");
  const [lastEdited, setLastEdited] = useState<"pyeong" | "sqm">("pyeong");

  useEffect(() => {
    if (lastEdited === "pyeong" && pyeong) {
      const value = parseFloat(pyeong);
      if (!isNaN(value)) {
        setSqm((value * PYEONG_TO_SQM).toFixed(2));
      }
    } else if (lastEdited === "sqm" && sqm) {
      const value = parseFloat(sqm);
      if (!isNaN(value)) {
        setPyeong((value / PYEONG_TO_SQM).toFixed(2));
      }
    }
  }, [pyeong, sqm, lastEdited]);

  const handlePyeongChange = (value: string) => {
    setPyeong(value);
    setLastEdited("pyeong");
  };

  const handleSqmChange = (value: string) => {
    setSqm(value);
    setLastEdited("sqm");
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
              onClick={() => handlePyeongChange(val.toString())}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                parseFloat(pyeong) === val
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
          <div className="relative">
            <input
              type="number"
              value={pyeong}
              onChange={(e) => handlePyeongChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="30"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">평</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-full p-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제곱미터 (㎡)</label>
          <div className="relative">
            <input
              type="number"
              value={sqm}
              onChange={(e) => handleSqmChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="99.17"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">㎡</span>
          </div>
        </div>
      </div>

      {(pyeong || sqm) && (
        <div className="mt-6 bg-emerald-50 rounded-xl p-4">
          <p className="text-sm text-emerald-700">
            <strong>{pyeong || "0"}평</strong>은 <strong>{sqm || "0"}㎡</strong>입니다.
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            (1평 = {PYEONG_TO_SQM}㎡)
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        <p>• 아파트 전용면적 기준</p>
        <p>• 실제 면적은 공급면적과 다를 수 있음</p>
      </div>
    </div>
  );
}
