"use client";

import { useState } from "react";

type SeasonType = "summer" | "other";

export function ElectricityCalculator() {
  const [usage, setUsage] = useState("350");
  const [season, setSeason] = useState<SeasonType>("other");

  const calculate = () => {
    const kwh = parseFloat(usage);
    if (isNaN(kwh) || kwh < 0) return null;

    // 2024년 기준 주택용 전기요금 (저압)
    // 기본요금 + 전력량 요금 + 기후환경요금 + 연료비조정액

    let baseFee = 0;
    let usageFee = 0;

    // 누진제 구간별 계산 (비여름)
    if (season === "other") {
      if (kwh <= 200) {
        baseFee = 910;
        usageFee = kwh * 120.0;
      } else if (kwh <= 400) {
        baseFee = 1600;
        usageFee = 200 * 120.0 + (kwh - 200) * 214.6;
      } else {
        baseFee = 7300;
        usageFee = 200 * 120.0 + 200 * 214.6 + (kwh - 400) * 307.3;
      }
    } else {
      // 여름철 (7~8월)
      if (kwh <= 300) {
        baseFee = 910;
        usageFee = kwh * 120.0;
      } else if (kwh <= 450) {
        baseFee = 1600;
        usageFee = 300 * 120.0 + (kwh - 300) * 214.6;
      } else {
        baseFee = 7300;
        usageFee = 300 * 120.0 + 150 * 214.6 + (kwh - 450) * 307.3;
      }
    }

    // 기후환경요금 (kWh당 9.0원)
    const climateFee = kwh * 9.0;

    // 연료비조정액 (kWh당 5.0원)
    const fuelAdjust = kwh * 5.0;

    const subtotal = baseFee + usageFee + climateFee + fuelAdjust;
    const vat = Math.round(subtotal * 0.1);
    const fund = Math.floor(subtotal * 0.037 / 10) * 10; // 전력산업기반기금 3.7%
    const total = Math.round(subtotal) + vat + fund;

    return {
      baseFee: Math.round(baseFee),
      usageFee: Math.round(usageFee),
      climateFee: Math.round(climateFee),
      fuelAdjust: Math.round(fuelAdjust),
      subtotal: Math.round(subtotal),
      vat,
      fund,
      total,
      perKwh: Math.round(total / kwh),
    };
  };

  const result = calculate();

  return (
    <div id="electricity" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">전기요금 계산기</h2>
          <p className="text-xs text-gray-500">주택용 전기요금 (저압)</p>
        </div>
        <span className="text-2xl">⚡</span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">사용량 (kWh)</label>
          <input
            type="number"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 text-lg"
            placeholder="350"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">계절</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSeason("other")}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                season === "other"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🌸 봄/가을/겨울
            </button>
            <button
              onClick={() => setSeason("summer")}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                season === "summer"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ☀️ 여름 (7~8월)
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-5 text-white">
            <p className="text-white/80 text-sm mb-1">예상 전기요금</p>
            <p className="text-3xl font-bold">
              {result.total.toLocaleString()}
              <span className="text-lg ml-1 font-normal opacity-80">원</span>
            </p>
            <p className="text-white/70 text-sm mt-2">
              kWh당 약 {result.perKwh.toLocaleString()}원
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">기본요금</span>
              <span className="font-medium">{result.baseFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">전력량요금</span>
              <span className="font-medium">{result.usageFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">기후환경요금</span>
              <span className="font-medium">{result.climateFee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">연료비조정액</span>
              <span className="font-medium">{result.fuelAdjust.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-600">부가세 (10%)</span>
              <span className="font-medium">{result.vat.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">전력산업기반기금 (3.7%)</span>
              <span className="font-medium">{result.fund.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">누진제 구간</p>
        <div className="text-xs text-gray-500 space-y-1">
          {season === "other" ? (
            <>
              <p>• 1구간: 0~200kWh (120원/kWh)</p>
              <p>• 2구간: 201~400kWh (214.6원/kWh)</p>
              <p>• 3구간: 401kWh~ (307.3원/kWh)</p>
            </>
          ) : (
            <>
              <p>• 1구간: 0~300kWh (120원/kWh)</p>
              <p>• 2구간: 301~450kWh (214.6원/kWh)</p>
              <p>• 3구간: 451kWh~ (307.3원/kWh)</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
