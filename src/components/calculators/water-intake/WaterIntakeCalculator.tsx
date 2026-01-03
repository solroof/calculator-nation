"use client";

import { useState } from "react";

type ActivityLevel = "low" | "moderate" | "high" | "very_high";

export function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("70");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [climate, setClimate] = useState<"normal" | "hot">("normal");

  const calculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;

    // 기본: 체중 × 30ml
    let baseWater = w * 30;

    // 활동량에 따른 조정
    const activityMultiplier = {
      low: 1.0,
      moderate: 1.2,
      high: 1.4,
      very_high: 1.6,
    };

    baseWater *= activityMultiplier[activity];

    // 더운 날씨
    if (climate === "hot") {
      baseWater *= 1.2;
    }

    const liters = baseWater / 1000;
    const glasses = Math.round(baseWater / 250); // 한 컵 = 250ml

    return {
      ml: Math.round(baseWater),
      liters: liters.toFixed(1),
      glasses,
      perHour: Math.round(baseWater / 16), // 깨어있는 16시간 기준
    };
  };

  const result = calculate();

  const activities = [
    { key: "low", label: "적음", desc: "앉아서 일하는 직장인" },
    { key: "moderate", label: "보통", desc: "가벼운 활동, 일상 생활" },
    { key: "high", label: "많음", desc: "규칙적 운동, 육체노동" },
    { key: "very_high", label: "매우 많음", desc: "강도 높은 운동" },
  ];

  return (
    <div id="water-intake" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">물 섭취량 계산기</h2>
          <p className="text-xs text-gray-500">하루 권장 물 섭취량</p>
        </div>
        <span className="text-2xl">💧</span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">체중 (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 text-lg"
            placeholder="체중 입력"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">활동량</label>
          <div className="grid grid-cols-2 gap-2">
            {activities.map((a) => (
              <button
                key={a.key}
                onClick={() => setActivity(a.key as ActivityLevel)}
                className={`px-3 py-2.5 rounded-lg text-left transition-all ${
                  activity === a.key
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <p className="text-sm font-medium">{a.label}</p>
                <p className={`text-xs ${activity === a.key ? "text-white/70" : "text-gray-400"}`}>
                  {a.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">날씨/환경</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setClimate("normal")}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                climate === "normal"
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🌤️ 보통
            </button>
            <button
              onClick={() => setClimate("hot")}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                climate === "hot"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ☀️ 더운 날씨
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">하루 권장 물 섭취량</p>
          <p className="text-4xl font-bold">
            {result.liters}
            <span className="text-lg ml-1 font-normal opacity-80">L</span>
          </p>
          <p className="text-white/70 text-sm mb-4">약 {result.ml.toLocaleString()}ml</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs">컵으로 환산</p>
              <p className="text-xl font-bold">{result.glasses}컵</p>
              <p className="text-white/60 text-xs">(250ml 기준)</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs">시간당</p>
              <p className="text-xl font-bold">{result.perHour}ml</p>
              <p className="text-white/60 text-xs">(깨어있는 시간)</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">물 섭취 팁</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 아침에 일어나자마자 물 한 잔</p>
          <p>• 식사 30분 전에 물 마시기</p>
          <p>• 커피/술 마신 후 추가 섭취 필요</p>
          <p>• 소변 색이 옅은 노란색이면 적당</p>
        </div>
      </div>
    </div>
  );
}
