"use client";

import { useState } from "react";

export function StatisticsCalculator() {
  const [input, setInput] = useState("85, 90, 78, 92, 88, 95, 82, 79, 91, 87");

  const parseNumbers = (): number[] => {
    return input
      .split(/[,\s\n]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
  };

  const calculate = () => {
    const numbers = parseNumbers();
    const n = numbers.length;

    if (n === 0) {
      return {
        count: 0,
        sum: 0,
        mean: 0,
        median: 0,
        mode: "-",
        min: 0,
        max: 0,
        range: 0,
        variance: 0,
        stdDev: 0,
        sampleVariance: 0,
        sampleStdDev: 0,
      };
    }

    // 합계
    const sum = numbers.reduce((a, b) => a + b, 0);

    // 평균
    const mean = sum / n;

    // 정렬된 배열
    const sorted = [...numbers].sort((a, b) => a - b);

    // 중앙값
    const median =
      n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

    // 최빈값
    const freq: Record<number, number> = {};
    numbers.forEach((num) => {
      freq[num] = (freq[num] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(freq));
    const modes = Object.entries(freq)
      .filter(([_, count]) => count === maxFreq)
      .map(([num]) => parseFloat(num));
    const modeStr = maxFreq === 1 ? "없음" : modes.slice(0, 3).join(", ") + (modes.length > 3 ? "..." : "");

    // 최소/최대
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // 모분산 & 모표준편차
    const squaredDiffs = numbers.map((num) => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
    const stdDev = Math.sqrt(variance);

    // 표본분산 & 표본표준편차
    const sampleVariance = n > 1 ? squaredDiffs.reduce((a, b) => a + b, 0) / (n - 1) : 0;
    const sampleStdDev = Math.sqrt(sampleVariance);

    return {
      count: n,
      sum,
      mean,
      median,
      mode: modeStr,
      min,
      max,
      range,
      variance,
      stdDev,
      sampleVariance,
      sampleStdDev,
    };
  };

  const result = calculate();

  return (
    <div id="statistics" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">통계 계산기</h2>
          <p className="text-xs text-gray-500">평균, 표준편차, 분산 등</p>
        </div>
        <span className="text-2xl">📊</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            데이터 입력 (쉼표, 공백, 줄바꿈으로 구분)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
            rows={4}
            placeholder="85, 90, 78, 92, 88..."
          />
          <p className="text-xs text-gray-400 mt-1">데이터 수: {result.count}개</p>
        </div>
      </div>

      {result.count > 0 && (
        <>
          <div className="mt-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-white/70 text-xs mb-1">평균 (Mean)</p>
                <p className="text-2xl font-bold">{result.mean.toFixed(4)}</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-xs mb-1">표본표준편차</p>
                <p className="text-2xl font-bold">{result.sampleStdDev.toFixed(4)}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-xs">합계</p>
                <p className="font-medium">{result.sum.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-xs">중앙값</p>
                <p className="font-medium">{result.median.toFixed(4)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-xs">최빈값</p>
                <p className="font-medium">{result.mode}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-xs">범위</p>
                <p className="font-medium">{result.range.toFixed(4)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-xs">최솟값</p>
                <p className="font-medium">{result.min}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-xs">최댓값</p>
                <p className="font-medium">{result.max}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm font-medium text-blue-800 mb-2">표본 통계량 (n-1)</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">표본분산</p>
                  <p className="font-mono">{result.sampleVariance.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">표본표준편차</p>
                  <p className="font-mono">{result.sampleStdDev.toFixed(4)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-2">모집단 통계량 (n)</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">모분산</p>
                  <p className="font-mono">{result.variance.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">모표준편차</p>
                  <p className="font-mono">{result.stdDev.toFixed(4)}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
