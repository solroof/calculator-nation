"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

export function PermutationCalculator() {
  const [n, setN] = useState<number>(10);
  const [r, setR] = useState<number>(3);

  // 팩토리얼 (큰 수 처리)
  const factorial = (num: number): number => {
    if (num < 0) return 0;
    if (num <= 1) return 1;
    if (num > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  // 순열 nPr
  const permutation = (n: number, r: number): number => {
    if (r > n || n < 0 || r < 0) return 0;
    let result = 1;
    for (let i = 0; i < r; i++) {
      result *= (n - i);
    }
    return result;
  };

  // 조합 nCr
  const combination = (n: number, r: number): number => {
    if (r > n || n < 0 || r < 0) return 0;
    if (r === 0 || r === n) return 1;
    // 더 효율적인 계산
    const smallerR = Math.min(r, n - r);
    let result = 1;
    for (let i = 0; i < smallerR; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
  };

  // 중복순열 n^r
  const permutationWithRepetition = (n: number, r: number): number => {
    if (n < 0 || r < 0) return 0;
    return Math.pow(n, r);
  };

  // 중복조합 nHr = (n+r-1)Cr
  const combinationWithRepetition = (n: number, r: number): number => {
    if (n < 1 || r < 0) return 0;
    return combination(n + r - 1, r);
  };

  const nVal = n || 0;
  const rVal = r || 0;

  const results = {
    permutation: permutation(nVal, rVal),
    combination: combination(nVal, rVal),
    permutationRep: permutationWithRepetition(nVal, rVal),
    combinationRep: combinationWithRepetition(nVal, rVal),
    nFactorial: factorial(nVal),
    rFactorial: factorial(rVal),
  };

  const formatNumber = (num: number): string => {
    if (!isFinite(num)) return "∞ (너무 큼)";
    if (num > 1e15) return num.toExponential(4);
    return num.toLocaleString();
  };

  return (
    <div id="permutation" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">순열/조합 계산기</h2>
          <p className="text-xs text-gray-500">nPr, nCr, 중복순열/조합</p>
        </div>
        <span className="text-2xl">🎯</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">n (전체 개수)</label>
            <NumberInput
              value={n}
              onChange={setN}
              min={0}
              step={1}
              format="none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">r (선택 개수)</label>
            <NumberInput
              value={r}
              onChange={setR}
              min={0}
              step={1}
              format="none"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">순열 (nPr)</p>
              <p className="text-white/70 text-xs">순서 O, 중복 X</p>
            </div>
            <p className="text-2xl font-bold">{formatNumber(results.permutation)}</p>
          </div>
          <p className="text-white/50 text-xs mt-2">n! / (n-r)! = {nVal}P{rVal}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">조합 (nCr)</p>
              <p className="text-white/70 text-xs">순서 X, 중복 X</p>
            </div>
            <p className="text-2xl font-bold">{formatNumber(results.combination)}</p>
          </div>
          <p className="text-white/50 text-xs mt-2">n! / (r!(n-r)!) = {nVal}C{rVal}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">중복순열 (nΠr)</p>
              <p className="text-white/70 text-xs">순서 O, 중복 O</p>
            </div>
            <p className="text-2xl font-bold">{formatNumber(results.permutationRep)}</p>
          </div>
          <p className="text-white/50 text-xs mt-2">n^r = {nVal}^{rVal}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">중복조합 (nHr)</p>
              <p className="text-white/70 text-xs">순서 X, 중복 O</p>
            </div>
            <p className="text-2xl font-bold">{formatNumber(results.combinationRep)}</p>
          </div>
          <p className="text-white/50 text-xs mt-2">(n+r-1)Cr = {nVal}H{rVal}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-3 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-500 text-xs">n!</p>
          <p className="font-mono font-medium">{formatNumber(results.nFactorial)}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-500 text-xs">r!</p>
          <p className="font-mono font-medium">{formatNumber(results.rFactorial)}</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 순열: nPr = n! / (n-r)!</p>
          <p>• 조합: nCr = n! / (r!(n-r)!)</p>
          <p>• 중복순열: nΠr = n^r</p>
          <p>• 중복조합: nHr = (n+r-1)Cr</p>
          <p>• 팩토리얼: n! = n × (n-1) × ... × 2 × 1</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">순열 vs 조합</p>
          <p>• 순열: 순서가 중요 (ex: 비밀번호)</p>
          <p>• 조합: 순서 무관 (ex: 로또 번호)</p>
        </div>
      </div>
    </div>
  );
}
