"use client";

import { useState } from "react";

export function RandomCalculator() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);

  const generateRandom = () => {
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    const countNum = parseInt(count);

    if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum)) return;
    if (minNum >= maxNum) return;

    const range = maxNum - minNum + 1;
    if (!allowDuplicates && countNum > range) {
      alert(`중복 불허 시 최대 ${range}개까지만 생성 가능합니다.`);
      return;
    }

    let newResults: number[] = [];

    if (allowDuplicates) {
      for (let i = 0; i < countNum; i++) {
        newResults.push(Math.floor(Math.random() * range) + minNum);
      }
    } else {
      const pool = Array.from({ length: range }, (_, i) => minNum + i);
      for (let i = 0; i < countNum; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        newResults.push(pool[idx]);
        pool.splice(idx, 1);
      }
    }

    setResults(newResults);
  };

  const presets = [
    { label: "로또", min: 1, max: 45, count: 6, dup: false },
    { label: "1~10", min: 1, max: 10, count: 1, dup: true },
    { label: "1~100", min: 1, max: 100, count: 1, dup: true },
    { label: "주사위", min: 1, max: 6, count: 1, dup: true },
  ];

  return (
    <div id="random" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">랜덤 숫자 생성기</h2>
          <p className="text-xs text-gray-500">무작위 번호 추첨</p>
        </div>
        <span className="text-2xl">🎲</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">빠른 선택</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setMin(p.min.toString());
                setMax(p.max.toString());
                setCount(p.count.toString());
                setAllowDuplicates(p.dup);
              }}
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">최솟값</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">최댓값</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">개수</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500"
            min="1"
            max="100"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!allowDuplicates}
            onChange={(e) => setAllowDuplicates(!e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">중복 제외</span>
        </label>
      </div>

      <button
        onClick={generateRandom}
        className="w-full py-3.5 rounded-xl font-medium bg-gradient-to-r from-gray-600 to-gray-700 text-white active:from-gray-700 active:to-gray-800 shadow-sm transition-all mb-4"
      >
        🎲 생성하기
      </button>

      {results.length > 0 && (
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-5">
          <p className="text-white/80 text-sm mb-3">결과</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {results.sort((a, b) => a - b).map((num, idx) => (
              <div
                key={idx}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg font-bold text-gray-800 shadow-lg"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
