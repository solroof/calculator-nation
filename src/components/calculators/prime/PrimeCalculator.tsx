"use client";

import { useState } from "react";

type Mode = "check" | "factorize" | "list";

export function PrimeCalculator() {
  const [mode, setMode] = useState<Mode>("check");
  const [number, setNumber] = useState("97");
  const [rangeStart, setRangeStart] = useState("1");
  const [rangeEnd, setRangeEnd] = useState("100");

  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  };

  const factorize = (n: number): number[] => {
    const factors: number[] = [];
    let num = n;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      while (num % i === 0) {
        factors.push(i);
        num = num / i;
      }
    }
    if (num > 1) factors.push(num);
    return factors;
  };

  const getPrimesInRange = (start: number, end: number): number[] => {
    const primes: number[] = [];
    for (let i = Math.max(2, start); i <= end && primes.length < 500; i++) {
      if (isPrime(i)) primes.push(i);
    }
    return primes;
  };

  const checkResult = () => {
    const num = parseInt(number);
    if (isNaN(num) || num < 1) return null;

    const prime = isPrime(num);
    const factors = factorize(num);

    return { num, isPrime: prime, factors };
  };

  const listResult = () => {
    const start = parseInt(rangeStart);
    const end = parseInt(rangeEnd);
    if (isNaN(start) || isNaN(end) || start > end) return null;

    const primes = getPrimesInRange(start, end);
    return { primes, count: primes.length };
  };

  const modes = [
    { key: "check", label: "소수 판별" },
    { key: "factorize", label: "소인수분해" },
    { key: "list", label: "소수 목록" },
  ];

  const result = mode === "list" ? null : checkResult();
  const listRes = mode === "list" ? listResult() : null;

  return (
    <div id="prime" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">소수 계산기</h2>
          <p className="text-xs text-gray-500">소수 판별 & 소인수분해</p>
        </div>
        <span className="text-2xl">🔢</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as Mode)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m.key
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode !== "list" ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">숫자 입력</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
            placeholder="숫자 입력"
            min="1"
          />
        </div>
      ) : (
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시작</label>
            <input
              type="number"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">끝</label>
            <input
              type="number"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              min="1"
            />
          </div>
        </div>
      )}

      {mode === "check" && result && (
        <div className={`rounded-2xl p-5 text-white ${
          result.isPrime
            ? "bg-gradient-to-br from-green-500 to-green-600"
            : "bg-gradient-to-br from-gray-500 to-gray-600"
        }`}>
          <p className="text-white/80 text-sm mb-1">{result.num}은(는)</p>
          <p className="text-3xl font-bold">
            {result.isPrime ? "소수입니다 ✓" : "소수가 아닙니다"}
          </p>
          {!result.isPrime && result.factors.length > 0 && (
            <p className="text-white/70 text-sm mt-2">
              약수: {result.factors.join(" × ")} = {result.num}
            </p>
          )}
        </div>
      )}

      {mode === "factorize" && result && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">{result.num}의 소인수분해</p>
          {result.factors.length > 0 ? (
            <>
              <p className="text-2xl font-bold font-mono">
                {result.factors.join(" × ")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[...new Set(result.factors)].map((f) => {
                  const count = result.factors.filter((x) => x === f).length;
                  return (
                    <span key={f} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      {f}{count > 1 ? <sup>{count}</sup> : ""}
                    </span>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-2xl font-bold">소수입니다</p>
          )}
        </div>
      )}

      {mode === "list" && listRes && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-2">
            {rangeStart}~{rangeEnd} 사이의 소수 ({listRes.count}개)
          </p>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {listRes.primes.map((p) => (
              <span key={p} className="px-2 py-1 bg-white/20 rounded text-sm">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">소수란?</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 1과 자기 자신으로만 나누어지는 1보다 큰 자연수</p>
          <p>• 가장 작은 소수: 2 (유일한 짝수 소수)</p>
          <p>• 예: 2, 3, 5, 7, 11, 13, 17, 19, 23...</p>
        </div>
      </div>
    </div>
  );
}
