"use client";

import { useState, useMemo } from "react";
import { NumberInput } from "@/components/ui";

type CalcMode = "whatPercent" | "percentOf" | "percentChange";

export function PercentCalculator() {
  const [mode, setMode] = useState<CalcMode>("percentOf");
  const [value1, setValue1] = useState<number>(10);
  const [value2, setValue2] = useState<number>(200);

  // 자동 계산
  const result = useMemo(() => {
    const v1 = value1 || 0;
    const v2 = value2 || 0;
    if (v1 === 0 && v2 === 0) {
      return null;
    }

    let res = 0;
    switch (mode) {
      case "percentOf":
        res = (v1 / 100) * v2;
        break;
      case "whatPercent":
        if (v2 === 0) {
          return null;
        }
        res = (v1 / v2) * 100;
        break;
      case "percentChange":
        if (v1 === 0) {
          return null;
        }
        res = ((v2 - v1) / v1) * 100;
        break;
    }
    return res;
  }, [value1, value2, mode]);

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
            onClick={() => setMode(m.id as CalcMode)}
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
              <div className="flex-1">
                <NumberInput
                  value={value1}
                  onChange={setValue1}
                  step={1}
                  format="comma"
                />
              </div>
              <span className="text-gray-500 font-medium">% 의</span>
              <div className="flex-1">
                <NumberInput
                  value={value2}
                  onChange={setValue2}
                  step={1}
                  format="comma"
                />
              </div>
            </div>
          </>
        )}

        {mode === "whatPercent" && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <NumberInput
                  value={value1}
                  onChange={setValue1}
                  step={1}
                  format="comma"
                />
              </div>
              <span className="text-gray-500 font-medium">는</span>
              <div className="flex-1">
                <NumberInput
                  value={value2}
                  onChange={setValue2}
                  step={1}
                  format="comma"
                />
              </div>
              <span className="text-gray-500 font-medium">의 몇%?</span>
            </div>
          </>
        )}

        {mode === "percentChange" && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <NumberInput
                  value={value1}
                  onChange={setValue1}
                  step={1}
                  format="comma"
                />
              </div>
              <span className="text-gray-500 font-medium">→</span>
              <div className="flex-1">
                <NumberInput
                  value={value2}
                  onChange={setValue2}
                  step={1}
                  format="comma"
                />
              </div>
            </div>
          </>
        )}
      </div>

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

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• A%의 B = B × (A / 100)</p>
          <p>• A는 B의 몇% = (A / B) × 100</p>
          <p>• A→B 변화율 = (B - A) / A × 100</p>
        </div>
      </div>
    </div>
  );
}
