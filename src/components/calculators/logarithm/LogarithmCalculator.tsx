"use client";

import { useState } from "react";

export function LogarithmCalculator() {
  const [mode, setMode] = useState<"log" | "ln" | "logBase">("log");
  const [value, setValue] = useState("100");
  const [base, setBase] = useState("2");

  const calculate = () => {
    const x = parseFloat(value) || 0;
    const b = parseFloat(base) || 10;

    if (x <= 0) return { result: NaN, valid: false, message: "양수만 가능" };
    if (mode === "logBase" && (b <= 0 || b === 1)) {
      return { result: NaN, valid: false, message: "밑은 양수이고 1이 아니어야 함" };
    }

    let result: number;
    let formula: string;

    switch (mode) {
      case "log":
        result = Math.log10(x);
        formula = `log₁₀(${x})`;
        break;
      case "ln":
        result = Math.log(x);
        formula = `ln(${x}) = logₑ(${x})`;
        break;
      case "logBase":
        result = Math.log(x) / Math.log(b);
        formula = `log${b}(${x})`;
        break;
      default:
        result = 0;
        formula = "";
    }

    return { result, valid: true, formula };
  };

  const result = calculate();

  // 추가 정보 계산
  const x = parseFloat(value) || 0;
  const additionalInfo = x > 0 ? {
    log10: Math.log10(x),
    ln: Math.log(x),
    log2: Math.log2(x),
    exp: Math.exp(x > 100 ? 100 : x), // 오버플로 방지
  } : null;

  return (
    <div id="logarithm" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">로그 계산기</h2>
          <p className="text-xs text-gray-500">log, ln, 밑 지정 로그</p>
        </div>
        <span className="text-2xl">📈</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMode("log")}
            className={`p-2 rounded-xl border-2 text-sm transition-all ${
              mode === "log"
                ? "border-amber-500 bg-amber-50 text-amber-600"
                : "border-gray-200"
            }`}
          >
            log (밑 10)
          </button>
          <button
            onClick={() => setMode("ln")}
            className={`p-2 rounded-xl border-2 text-sm transition-all ${
              mode === "ln"
                ? "border-amber-500 bg-amber-50 text-amber-600"
                : "border-gray-200"
            }`}
          >
            ln (자연로그)
          </button>
          <button
            onClick={() => setMode("logBase")}
            className={`p-2 rounded-xl border-2 text-sm transition-all ${
              mode === "logBase"
                ? "border-amber-500 bg-amber-50 text-amber-600"
                : "border-gray-200"
            }`}
          >
            밑 지정
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">값 (x)</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-lg"
            placeholder="100"
          />
        </div>

        {mode === "logBase" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">밑 (base)</label>
            <input
              type="number"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              placeholder="2"
            />
          </div>
        )}
      </div>

      <div className="mt-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">{result.formula}</p>
          <p className="text-3xl font-bold">
            {result.valid ? result.result.toFixed(8) : result.message}
          </p>
        </div>
      </div>

      {additionalInfo && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">다른 로그 값</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">log₁₀({value})</p>
              <p className="font-mono">{additionalInfo.log10.toFixed(6)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">ln({value})</p>
              <p className="font-mono">{additionalInfo.ln.toFixed(6)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">log₂({value})</p>
              <p className="font-mono">{additionalInfo.log2.toFixed(6)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">e^{x > 100 ? "100" : value}</p>
              <p className="font-mono">{additionalInfo.exp.toExponential(4)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-amber-50 rounded-xl">
        <p className="text-sm font-medium text-amber-800 mb-1">로그 공식</p>
        <div className="text-xs text-gray-600 space-y-1">
          <p>log_b(x) = ln(x) / ln(b)</p>
          <p>log(xy) = log(x) + log(y)</p>
          <p>log(x/y) = log(x) - log(y)</p>
          <p>log(x^n) = n × log(x)</p>
        </div>
      </div>
    </div>
  );
}
