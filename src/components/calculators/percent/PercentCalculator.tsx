"use client";

import { useState } from "react";

type CalcMode = "whatPercent" | "percentOf" | "percentChange";

export function PercentCalculator() {
  const [mode, setMode] = useState<CalcMode>("percentOf");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);
    if (isNaN(v1) || isNaN(v2)) return;

    let res = 0;
    switch (mode) {
      case "percentOf":
        res = (v1 / 100) * v2;
        break;
      case "whatPercent":
        res = (v1 / v2) * 100;
        break;
      case "percentChange":
        res = ((v2 - v1) / v1) * 100;
        break;
    }
    setResult(res);
  };

  const modes = [
    { id: "percentOf", label: "A%의 B는?", desc: "퍼센트 값 계산" },
    { id: "whatPercent", label: "A는 B의 몇%?", desc: "비율 계산" },
    { id: "percentChange", label: "A→B 변화율", desc: "증감률 계산" },
  ];

  return (
    <div id="percent" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">퍼센트 계산기</h2>
          <p className="text-xs text-gray-500">다양한 퍼센트 계산</p>
        </div>
        <span className="text-2xl">％</span>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id as CalcMode); setResult(null); }}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              mode === m.id
                ? "bg-violet-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-4">
        {mode === "percentOf" && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-center"
                placeholder="10"
              />
              <span className="text-gray-500 font-medium">% 의</span>
              <input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-center"
                placeholder="200"
              />
            </div>
          </>
        )}

        {mode === "whatPercent" && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-center"
                placeholder="25"
              />
              <span className="text-gray-500 font-medium">는</span>
              <input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-center"
                placeholder="100"
              />
              <span className="text-gray-500 font-medium">의 몇%?</span>
            </div>
          </>
        )}

        {mode === "percentChange" && (
          <>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-center"
                placeholder="이전 값"
              />
              <span className="text-gray-500 font-medium">→</span>
              <input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-center"
                placeholder="이후 값"
              />
            </div>
          </>
        )}
      </div>

      <button
        onClick={calculate}
        className="w-full py-3.5 rounded-xl font-medium bg-violet-500 text-white active:bg-violet-600 shadow-sm transition-all mb-4"
      >
        계산하기
      </button>

      {result !== null && (
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">결과</p>
          <p className="text-3xl font-bold">
            {mode === "percentOf"
              ? result.toLocaleString("ko-KR", { maximumFractionDigits: 2 })
              : `${result >= 0 ? "+" : ""}${result.toFixed(2)}%`}
          </p>
          {mode === "percentChange" && (
            <p className="text-white/70 text-sm mt-2">
              {result >= 0 ? "증가" : "감소"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
