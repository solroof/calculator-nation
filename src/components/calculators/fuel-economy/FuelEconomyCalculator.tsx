"use client";

import { useState } from "react";
import { NumberInput, MoneyInput } from "@/components/ui";

type CalcMode = "economy" | "cost" | "distance";

export function FuelEconomyCalculator() {
  const [mode, setMode] = useState<CalcMode>("economy");
  const [distance, setDistance] = useState<number>(500);
  const [fuel, setFuel] = useState<number>(50);
  const [fuelPrice, setFuelPrice] = useState<number>(1650);
  const [fuelEconomy, setFuelEconomy] = useState<number>(12);

  const calculate = () => {

    switch (mode) {
      case "economy":
        // 연비 계산: 주행거리 / 주유량
        if (fuel <= 0) return null;
        const calculatedEconomy = distance / fuel;
        return {
          result: calculatedEconomy,
          unit: "km/L",
          description: `${distance}km를 ${fuel}L로 주행`,
          detail: `연비: ${calculatedEconomy.toFixed(2)} km/L`,
        };

      case "cost":
        // 주유비 계산: (주행거리 / 연비) * 유가
        if (fuelEconomy <= 0) return null;
        const fuelNeeded = distance / fuelEconomy;
        const totalCost = fuelNeeded * fuelPrice;
        return {
          result: totalCost,
          unit: "원",
          description: `${distance}km 주행 시 예상 주유비`,
          detail: `필요 연료: ${fuelNeeded.toFixed(1)}L`,
        };

      case "distance":
        // 주행 가능 거리: 연료량 * 연비
        const maxDistance = fuel * fuelEconomy;
        return {
          result: maxDistance,
          unit: "km",
          description: `${fuel}L로 주행 가능 거리`,
          detail: `연비 ${fuelEconomy}km/L 기준`,
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
              <label className="block text-sm font-medium text-gray-700 mb-1">주행 거리</label>
              <NumberInput
                value={distance}
                onChange={setDistance}
                min={0}
                step={10}
                format="comma"
                suffix="km"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주유량</label>
              <NumberInput
                value={fuel}
                onChange={setFuel}
                min={0}
                step={1}
                format="none"
                suffix="L"
              />
            </div>
          </>
        )}

        {mode === "cost" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주행 예정 거리</label>
              <NumberInput
                value={distance}
                onChange={setDistance}
                min={0}
                step={10}
                format="comma"
                suffix="km"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">차량 연비</label>
              <NumberInput
                value={fuelEconomy}
                onChange={setFuelEconomy}
                min={1}
                max={50}
                step={0.1}
                format="none"
                suffix="km/L"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연료 가격</label>
              <MoneyInput
                value={fuelPrice}
                onChange={setFuelPrice}
                step={10}
                suffix="원/L"
              />
            </div>
          </>
        )}

        {mode === "distance" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연료량</label>
              <NumberInput
                value={fuel}
                onChange={setFuel}
                min={0}
                step={1}
                format="none"
                suffix="L"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">차량 연비</label>
              <NumberInput
                value={fuelEconomy}
                onChange={setFuelEconomy}
                min={1}
                max={50}
                step={0.1}
                format="none"
                suffix="km/L"
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

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 연비 = 주행거리(km) ÷ 주유량(L)</p>
          <p>• 주유비 = (거리 ÷ 연비) × 유가</p>
          <p>• 주행거리 = 연료량 × 연비</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">평균 연비 참고</p>
          <p>• 경차: 15~18 km/L</p>
          <p>• 소형차: 12~15 km/L</p>
          <p>• 중형차: 10~13 km/L</p>
        </div>
      </div>
    </div>
  );
}
