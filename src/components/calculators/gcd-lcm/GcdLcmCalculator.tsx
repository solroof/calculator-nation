"use client";

import { useState } from "react";

export function GcdLcmCalculator() {
  const [numbers, setNumbers] = useState("12, 18");

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const lcm = (a: number, b: number): number => {
    return (a * b) / gcd(a, b);
  };

  const calculate = () => {
    const nums = numbers
      .split(/[,\s]+/)
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    if (nums.length < 2) return null;

    let resultGcd = nums[0];
    let resultLcm = nums[0];

    for (let i = 1; i < nums.length; i++) {
      resultGcd = gcd(resultGcd, nums[i]);
      resultLcm = lcm(resultLcm, nums[i]);
    }

    // 공약수 목록
    const divisors: number[] = [];
    for (let i = 1; i <= resultGcd; i++) {
      if (resultGcd % i === 0) {
        divisors.push(i);
      }
    }

    // 공배수 목록 (처음 10개)
    const multiples: number[] = [];
    for (let i = 1; i <= 10; i++) {
      multiples.push(resultLcm * i);
    }

    return {
      numbers: nums,
      gcd: resultGcd,
      lcm: resultLcm,
      divisors,
      multiples,
    };
  };

  const result = calculate();

  return (
    <div id="gcd-lcm" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">최대공약수/최소공배수</h2>
          <p className="text-xs text-gray-500">GCD / LCM 계산</p>
        </div>
        <span className="text-2xl">🔢</span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          숫자 입력 (쉼표 또는 공백으로 구분)
        </label>
        <input
          type="text"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
          placeholder="예: 12, 18, 24"
        />
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white">
              <p className="text-white/80 text-xs mb-1">최대공약수 (GCD)</p>
              <p className="text-3xl font-bold">{result.gcd.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
              <p className="text-white/80 text-xs mb-1">최소공배수 (LCM)</p>
              <p className="text-3xl font-bold">{result.lcm.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">입력한 숫자</p>
            <div className="flex flex-wrap gap-2">
              {result.numbers.map((n, idx) => (
                <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm">
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">공약수</p>
            <div className="flex flex-wrap gap-2">
              {result.divisors.map((d) => (
                <span key={d} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">공배수 (처음 10개)</p>
            <div className="flex flex-wrap gap-2">
              {result.multiples.map((m) => (
                <span key={m} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                  {m.toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">개념 설명</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 최대공약수(GCD): 두 수를 나눌 수 있는 가장 큰 수</p>
          <p>• 최소공배수(LCM): 두 수의 공통 배수 중 가장 작은 수</p>
          <p>• GCD × LCM = 두 수의 곱 (두 수일 경우)</p>
        </div>
      </div>
    </div>
  );
}
