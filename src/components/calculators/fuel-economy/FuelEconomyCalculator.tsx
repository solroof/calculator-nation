"use client";

import { useState } from "react";

type CalcMode = "economy" | "cost" | "distance";

export function FuelEconomyCalculator() {
  const [mode, setMode] = useState<CalcMode>("economy");
  const [distance, setDistance] = useState("500");
  const [fuel, setFuel] = useState("50");
  const [fuelPrice, setFuelPrice] = useState("1650");
  const [fuelEconomy, setFuelEconomy] = useState("12");

  const calculate = () => {
    const dist = parseFloat(distance);
    const fuelAmount = parseFloat(fuel);
    const price = parseFloat(fuelPrice);
    const economy = parseFloat(fuelEconomy);

    switch (mode) {
      case "economy":
        // 연비 계산: 주행거리 / 주유량
        if (isNaN(dist) || isNaN(fuelAmount) || fuelAmount <= 0) return null;
        const calculatedEconomy = dist / fuelAmount;
        return {
          result: calculatedEconomy,
          unit: "km/L",
          description: `${dist}km를 ${fuelAmount}L로 주행`,
          detail: `연비: ${calculatedEconomy.toFixed(2)} km/L`,
        };

      case "cost":
        // 주유비 계산: (주행거리 / 연비) * 유가
        if (isNaN(dist) || isNaN(economy) || isNaN(price) || economy <= 0) return null;
        const fuelNeeded = dist / economy;
        const totalCost = fuelNeeded * price;
        return {
          result: totalCost,
          unit: "원",
          description: `${dist}km 주행 시 예상 주유비`,
          detail: `필요 연료: ${fuelNeeded.toFixed(1)}L`,
        };

      case "distance":
        // 주행 가능 거리: 연료량 * 연비
        if (isNaN(fuelAmount) || isNaN(economy)) return null;
        const maxDistance = fuelAmount * economy;
        return {
          result: maxDistance,
          unit: "km",
          description: `${fuelAmount}L로 주행 가능 거리`,
          detail: `연비 ${economy}km/L 기준`,
        };

      default:
        return null;
    }
  };

  const result = calculate();

  const modes = [
    { key: "economy", label: "연비 계산", desc: "주행거리 ÷ 주유량" },
    { key: "cost", label: "주유비 계산", desc: "예상 연료비" },
    { key: "distance", label: "주행거리 계산", desc: "최대 주행거리" },
  ];

  return (
    <div id="fuel-economy" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">연비 계산기</h2>
          <p className="text-xs text-gray-500">연비, 주유비, 주행거리 계산</p>
        </div>
        <span className="text-2xl">⛽</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as CalcMode)}
              className={`px-2 py-2.5 rounded-lg text-xs font-medium transition-all ${
                mode === m.key
                  ? "bg-slate-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <p>{m.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {mode === "economy" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주행 거리 (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 text-lg"
                placeholder="예: 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주유량 (L)</label>
              <input
                type="number"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 text-lg"
                placeholder="예: 50"
              />
            </div>
          </>
        )}

        {mode === "cost" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주행 예정 거리 (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 text-lg"
                placeholder="예: 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">차량 연비 (km/L)</label>
              <input
                type="number"
                value={fuelEconomy}
                onChange={(e) => setFuelEconomy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 text-lg"
                placeholder="예: 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연료 가격 (원/L)</label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 text-lg"
                placeholder="예: 1650"
              />
            </div>
          </>
        )}

        {mode === "distance" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연료량 (L)</label>
              <input
                type="number"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 text-lg"
                placeholder="예: 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">차량 연비 (km/L)</label>
              <input
                type="number"
                value={fuelEconomy}
                onChange={(e) => setFuelEconomy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-500 text-lg"
                placeholder="예: 12"
              />
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">{result.description}</p>
          <p className="text-3xl font-bold">
            {result.result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            <span className="text-lg ml-1 font-normal opacity-80">{result.unit}</span>
          </p>
          <p className="text-white/60 text-sm mt-2">{result.detail}</p>
        </div>
      )}
    </div>
  );
}
