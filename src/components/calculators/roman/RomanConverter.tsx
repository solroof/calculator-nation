"use client";

import { useState } from "react";

const romanNumerals: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function RomanConverter() {
  const [mode, setMode] = useState<"toRoman" | "toArabic">("toRoman");
  const [arabicInput, setArabicInput] = useState("2024");
  const [romanInput, setRomanInput] = useState("MMXXIV");

  const toRoman = (num: number): string => {
    if (num <= 0 || num > 3999) return "1-3999 사이만 가능";
    let result = "";
    let remaining = num;
    for (const [value, symbol] of romanNumerals) {
      while (remaining >= value) {
        result += symbol;
        remaining -= value;
      }
    }
    return result;
  };

  const toArabic = (roman: string): number | string => {
    const upperRoman = roman.toUpperCase().trim();
    if (!/^[MDCLXVI]+$/.test(upperRoman)) {
      return "올바른 로마 숫자를 입력하세요";
    }

    const values: Record<string, number> = {
      M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1,
    };

    let result = 0;
    for (let i = 0; i < upperRoman.length; i++) {
      const current = values[upperRoman[i]];
      const next = values[upperRoman[i + 1]] || 0;
      if (current < next) {
        result -= current;
      } else {
        result += current;
      }
    }
    return result;
  };

  const arabicNum = parseInt(arabicInput) || 0;
  const romanResult = toRoman(arabicNum);
  const arabicResult = toArabic(romanInput);

  // 일반적인 예시
  const examples = [
    { arabic: 1, roman: "I" },
    { arabic: 5, roman: "V" },
    { arabic: 10, roman: "X" },
    { arabic: 50, roman: "L" },
    { arabic: 100, roman: "C" },
    { arabic: 500, roman: "D" },
    { arabic: 1000, roman: "M" },
  ];

  return (
    <div id="roman" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">로마 숫자 변환</h2>
          <p className="text-xs text-gray-500">아라비아 숫자 ↔ 로마 숫자</p>
        </div>
        <span className="text-2xl">🏛️</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode("toRoman")}
            className={`p-3 rounded-xl border-2 transition-all ${
              mode === "toRoman"
                ? "border-amber-500 bg-amber-50 text-amber-600"
                : "border-gray-200"
            }`}
          >
            <p className="font-medium">→ 로마 숫자</p>
            <p className="text-xs text-gray-500">123 → CXXIII</p>
          </button>
          <button
            onClick={() => setMode("toArabic")}
            className={`p-3 rounded-xl border-2 transition-all ${
              mode === "toArabic"
                ? "border-amber-500 bg-amber-50 text-amber-600"
                : "border-gray-200"
            }`}
          >
            <p className="font-medium">→ 아라비아 숫자</p>
            <p className="text-xs text-gray-500">CXXIII → 123</p>
          </button>
        </div>

        {mode === "toRoman" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                아라비아 숫자 (1-3999)
              </label>
              <input
                type="number"
                value={arabicInput}
                onChange={(e) => setArabicInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-lg"
                min="1"
                max="3999"
              />
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
              <p className="text-white/70 text-sm mb-1 text-center">로마 숫자</p>
              <p className="text-3xl font-bold text-center tracking-wider">{romanResult}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                로마 숫자
              </label>
              <input
                type="text"
                value={romanInput}
                onChange={(e) => setRomanInput(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-lg uppercase tracking-wider"
                placeholder="MMXXIV"
              />
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
              <p className="text-white/70 text-sm mb-1 text-center">아라비아 숫자</p>
              <p className="text-3xl font-bold text-center">{arabicResult}</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 p-3 bg-amber-50 rounded-xl">
        <p className="text-sm font-medium text-amber-800 mb-2">로마 숫자 기호</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {examples.map((ex) => (
            <div key={ex.arabic} className="text-xs">
              <p className="font-bold text-amber-700">{ex.roman}</p>
              <p className="text-gray-500">{ex.arabic}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 p-3 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-600">
          <strong>규칙:</strong> 작은 숫자가 큰 숫자 앞에 오면 빼기 (IV=4, IX=9)
        </p>
      </div>
    </div>
  );
}
