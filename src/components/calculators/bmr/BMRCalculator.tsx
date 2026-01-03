"use client";

import { useState, useMemo } from "react";
import { bmrCalculator } from "@/lib/math/bmr-calculator";
import { ACTIVITY_LEVELS } from "@/lib/types/bmr";
import type { Gender, ActivityLevel } from "@/lib/types/bmr";

export function BMRCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<string>("30");
  const [height, setHeight] = useState<string>("170");
  const [weight, setWeight] = useState<string>("70");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");

  const result = useMemo(() => {
    const a = parseInt(age) || 0;
    const h = parseFloat(height) || 0;
    const w = parseFloat(weight) || 0;

    if (a <= 0 || h <= 0 || w <= 0) return null;

    return bmrCalculator.calculate({ gender, age: a, height: h, weight: w, activityLevel });
  }, [gender, age, height, weight, activityLevel]);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        BMR 기초대사량 계산기
      </h2>

      <div className="space-y-4 mb-6">
        {/* 성별 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender("male")}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                gender === "male"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              남성
            </button>
            <button
              onClick={() => setGender("female")}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                gender === "female"
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        {/* 나이, 키, 몸무게 */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">나이</label>
            <input
              type="text"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">키 (cm)</label>
            <input
              type="text"
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
              placeholder="170"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">몸무게 (kg)</label>
            <input
              type="text"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center"
              placeholder="70"
            />
          </div>
        </div>

        {/* 활동량 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">활동량</label>
          <div className="space-y-2">
            {Object.entries(ACTIVITY_LEVELS).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setActivityLevel(key as ActivityLevel)}
                className={`w-full px-4 py-2 text-left rounded-lg border transition-colors ${
                  activityLevel === key
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                <div className="font-medium">{info.label}</div>
                <div className="text-xs text-gray-500">{info.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">기초대사량 (BMR)</div>
              <div className="text-2xl font-bold text-blue-600">{result.bmr} kcal</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">일일 소비량 (TDEE)</div>
              <div className="text-2xl font-bold text-green-600">{result.tdee} kcal</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">목표별 권장 섭취량</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">체중 감량 (-500kcal)</span>
                <span className="font-medium">{result.macros.weightLoss.calories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">체중 유지</span>
                <span className="font-medium">{result.macros.maintenance.calories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">체중 증가 (+500kcal)</span>
                <span className="font-medium">{result.macros.weightGain.calories} kcal</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            * Mifflin-St Jeor 공식 기준으로 계산됩니다.
          </div>
        </div>
      )}
    </div>
  );
}
