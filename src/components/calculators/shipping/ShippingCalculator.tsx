"use client";

import { useState } from "react";

// 택배사별 기본 요금표 (2024년 기준)
const carriers = {
  cj: { name: "CJ대한통운", base: 3500, perKg: 500 },
  hanjin: { name: "한진택배", base: 3500, perKg: 500 },
  lotte: { name: "롯데택배", base: 3300, perKg: 450 },
  post: { name: "우체국택배", base: 4000, perKg: 400 },
};

// 크기별 추가 요금
const sizeRates = [
  { maxSize: 80, rate: 0 },
  { maxSize: 100, rate: 1000 },
  { maxSize: 120, rate: 2000 },
  { maxSize: 140, rate: 3000 },
  { maxSize: 160, rate: 5000 },
];

export function ShippingCalculator() {
  const [weight, setWeight] = useState("2");
  const [length, setLength] = useState("30");
  const [width, setWidth] = useState("20");
  const [height, setHeight] = useState("15");
  const [isJeju, setIsJeju] = useState(false);

  const calculate = () => {
    const w = parseFloat(weight) || 0;
    const l = parseFloat(length) || 0;
    const wd = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;

    // 부피 무게 계산 (가로+세로+높이 합)
    const totalSize = l + wd + h;

    // 부피 무게 (cm³ / 6000)
    const volumeWeight = (l * wd * h) / 6000;
    const chargeWeight = Math.max(w, volumeWeight);

    // 크기별 추가 요금 찾기
    let sizeCharge = 5000;
    for (const tier of sizeRates) {
      if (totalSize <= tier.maxSize) {
        sizeCharge = tier.rate;
        break;
      }
    }

    // 각 택배사별 요금 계산
    const results = Object.entries(carriers).map(([key, carrier]) => {
      let price = carrier.base;

      // 무게 추가 요금 (2kg 초과분)
      if (chargeWeight > 2) {
        price += Math.ceil(chargeWeight - 2) * carrier.perKg;
      }

      // 크기 추가 요금
      price += sizeCharge;

      // 제주/도서 추가
      if (isJeju) {
        price += 3000;
      }

      return {
        key,
        name: carrier.name,
        price,
      };
    });

    // 가격순 정렬
    results.sort((a, b) => a.price - b.price);

    return {
      totalSize,
      volumeWeight: volumeWeight.toFixed(1),
      chargeWeight: chargeWeight.toFixed(1),
      sizeCharge,
      results,
    };
  };

  const result = calculate();

  return (
    <div id="shipping" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">택배비 계산기</h2>
          <p className="text-xs text-gray-500">크기/무게별 택배 요금</p>
        </div>
        <span className="text-2xl">📦</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">실제 무게 (kg)</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg"
            placeholder="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">박스 크기 (cm)</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-center"
                placeholder="가로"
              />
              <p className="text-xs text-gray-400 text-center mt-1">가로</p>
            </div>
            <div>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-center"
                placeholder="세로"
              />
              <p className="text-xs text-gray-400 text-center mt-1">세로</p>
            </div>
            <div>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-center"
                placeholder="높이"
              />
              <p className="text-xs text-gray-400 text-center mt-1">높이</p>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={isJeju}
            onChange={(e) => setIsJeju(e.target.checked)}
            className="w-4 h-4 text-orange-500 rounded"
          />
          <span className="text-sm text-gray-700">제주/도서지역 (+3,000원)</span>
        </label>
      </div>

      <div className="mt-4 p-3 bg-orange-50 rounded-xl">
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="text-gray-500 text-xs">총 크기</p>
            <p className="font-medium">{result.totalSize}cm</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">부피무게</p>
            <p className="font-medium">{result.volumeWeight}kg</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">적용무게</p>
            <p className="font-medium">{result.chargeWeight}kg</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {result.results.map((carrier, idx) => (
          <div
            key={carrier.key}
            className={`flex justify-between items-center p-4 rounded-xl ${
              idx === 0
                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              {idx === 0 && <span>🏆</span>}
              <span className={idx === 0 ? "font-medium" : "text-gray-700"}>{carrier.name}</span>
            </div>
            <span className={`text-xl font-bold ${idx === 0 ? "" : "text-gray-800"}`}>
              {carrier.price.toLocaleString()}원
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        * 요금은 택배사 및 계약조건에 따라 다를 수 있습니다
      </p>
    </div>
  );
}
