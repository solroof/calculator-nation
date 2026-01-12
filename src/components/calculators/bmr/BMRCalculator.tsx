"use client";

import { useState, useMemo } from "react";
import { bmrCalculator } from "@/lib/math/bmr-calculator";
import { ACTIVITY_LEVELS } from "@/lib/types/bmr";
import type { Gender, ActivityLevel } from "@/lib/types/bmr";
import { NumberInput } from "@/components/ui";

export function BMRCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<number>(30);
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");

  const result = useMemo(() => {
    if (age <= 0 || height <= 0 || weight <= 0) return null;

    return bmrCalculator.calculate({ gender, age, height, weight, activityLevel });
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
            <NumberInput
              value={age}
              onChange={setAge}
              min={1}
              max={120}
              step={1}
              format="none"
              suffix="세"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">키</label>
            <NumberInput
              value={height}
              onChange={setHeight}
              min={100}
              max={250}
              step={1}
              format="none"
              suffix="cm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">몸무게</label>
            <NumberInput
              value={weight}
              onChange={setWeight}
              min={20}
              max={200}
              step={1}
              format="none"
              suffix="kg"
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

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">계산 공식 (Mifflin-St Jeor)</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 남성: BMR = 10×체중(kg) + 6.25×키(cm) - 5×나이 + 5</p>
              <p>• 여성: BMR = 10×체중(kg) + 6.25×키(cm) - 5×나이 - 161</p>
              <p>• TDEE = BMR × 활동계수</p>
              <p className="pl-3 mt-1">활동계수: 비활동 1.2 ~ 매우활동적 1.9</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
