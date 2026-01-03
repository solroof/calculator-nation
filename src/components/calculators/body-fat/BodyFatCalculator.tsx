"use client";

import { useState } from "react";

type Gender = "male" | "female";

export function BodyFatCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("175");
  const [neck, setNeck] = useState("38");
  const [waist, setWaist] = useState("85");
  const [hip, setHip] = useState("95");

  const calculateBodyFat = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const waistNum = parseFloat(waist);
    const hipNum = parseFloat(hip);

    if (isNaN(w) || isNaN(h) || isNaN(n) || isNaN(waistNum)) return null;

    let bodyFat: number;

    // US Navy Method
    if (gender === "male") {
      bodyFat =
        495 /
          (1.0324 -
            0.19077 * Math.log10(waistNum - n) +
            0.15456 * Math.log10(h)) -
        450;
    } else {
      if (isNaN(hipNum)) return null;
      bodyFat =
        495 /
          (1.29579 -
            0.35004 * Math.log10(waistNum + hipNum - n) +
            0.221 * Math.log10(h)) -
        450;
    }

    bodyFat = Math.max(0, Math.min(60, bodyFat));

    // 체지방량 (kg)
    const fatMass = (w * bodyFat) / 100;
    // 제지방량 (kg)
    const leanMass = w - fatMass;

    // 평가
    let status: string;
    let statusColor: string;

    if (gender === "male") {
      if (bodyFat < 6) {
        status = "필수 지방";
        statusColor = "text-red-500";
      } else if (bodyFat < 14) {
        status = "운동선수";
        statusColor = "text-blue-500";
      } else if (bodyFat < 18) {
        status = "건강";
        statusColor = "text-green-500";
      } else if (bodyFat < 25) {
        status = "평균";
        statusColor = "text-yellow-500";
      } else {
        status = "비만";
        statusColor = "text-red-500";
      }
    } else {
      if (bodyFat < 14) {
        status = "필수 지방";
        statusColor = "text-red-500";
      } else if (bodyFat < 21) {
        status = "운동선수";
        statusColor = "text-blue-500";
      } else if (bodyFat < 25) {
        status = "건강";
        statusColor = "text-green-500";
      } else if (bodyFat < 32) {
        status = "평균";
        statusColor = "text-yellow-500";
      } else {
        status = "비만";
        statusColor = "text-red-500";
      }
    }

    return {
      bodyFat: bodyFat.toFixed(1),
      fatMass: fatMass.toFixed(1),
      leanMass: leanMass.toFixed(1),
      status,
      statusColor,
    };
  };

  const result = calculateBodyFat();

  return (
    <div id="body-fat" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">체지방률 계산기</h2>
          <p className="text-xs text-gray-500">US Navy Method</p>
        </div>
        <span className="text-2xl">💪</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGender("male")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              gender === "male"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            남성
          </button>
          <button
            onClick={() => setGender("female")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              gender === "female"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            여성
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">키 (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">체중 (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">목둘레 (cm)</label>
            <input
              type="number"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">허리둘레 (cm)</label>
            <input
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {gender === "female" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">엉덩이둘레 (cm)</label>
            <input
              type="number"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
            />
          </div>
        )}
      </div>

      {result && (
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">체지방률</p>
              <p className="text-4xl font-bold">
                {result.bodyFat}
                <span className="text-lg ml-1 font-normal opacity-80">%</span>
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium bg-white ${result.statusColor}`}>
              {result.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/70 text-xs">체지방량</p>
              <p className="font-medium">{result.fatMass} kg</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">제지방량</p>
              <p className="font-medium">{result.leanMass} kg</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">체지방률 기준</p>
        <div className="text-xs text-gray-500 space-y-1">
          {gender === "male" ? (
            <>
              <p>• 필수 지방: 2-5%</p>
              <p>• 운동선수: 6-13%</p>
              <p>• 건강: 14-17%</p>
              <p>• 평균: 18-24%</p>
              <p>• 비만: 25% 이상</p>
            </>
          ) : (
            <>
              <p>• 필수 지방: 10-13%</p>
              <p>• 운동선수: 14-20%</p>
              <p>• 건강: 21-24%</p>
              <p>• 평균: 25-31%</p>
              <p>• 비만: 32% 이상</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
