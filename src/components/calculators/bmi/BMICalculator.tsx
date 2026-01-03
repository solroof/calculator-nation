"use client";

import { useState, useMemo } from "react";
import { bmiCalculator } from "@/lib/math/bmi-calculator";
import { BMI_CATEGORIES } from "@/lib/types/bmi";

export function BMICalculator() {
  const [height, setHeight] = useState<string>("170");
  const [weight, setWeight] = useState<string>("70");

  const result = useMemo(() => {
    const h = parseFloat(height) || 0;
    const w = parseFloat(weight) || 0;

    if (h <= 0 || w <= 0) return null;

    return bmiCalculator.calculate({ height: h, weight: w });
  }, [height, weight]);

  // BMI 게이지 위치 계산 (0-40 범위)
  const gaugePosition = result ? Math.min(Math.max(result.bmi / 40 * 100, 0), 100) : 0;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        BMI 계산기
      </h2>

      {/* 입력 폼 */}
      <div className="space-y-4 mb-6">
        {/* 키 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            키 (cm)
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(e) => setHeight(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right text-lg"
            placeholder="170"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {[160, 165, 170, 175, 180].map((h) => (
              <button
                key={h}
                onClick={() => setHeight(h.toString())}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
              >
                {h}cm
              </button>
            ))}
          </div>
        </div>

        {/* 몸무게 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            몸무게 (kg)
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right text-lg"
            placeholder="70"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {[50, 60, 70, 80, 90].map((w) => (
              <button
                key={w}
                onClick={() => setWeight(w.toString())}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
              >
                {w}kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          {/* BMI 수치 */}
          <div className={`rounded-xl p-4 ${result.categoryBgColor}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">BMI 지수</span>
              <span className={`text-sm font-medium px-2 py-0.5 rounded ${result.categoryBgColor} ${result.categoryColor}`}>
                {result.categoryLabel}
              </span>
            </div>
            <div className={`text-3xl font-bold ${result.categoryColor}`}>
              {result.bmi}
            </div>
          </div>

          {/* BMI 게이지 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-500">
              <div
                className="absolute top-0 w-1 h-full bg-gray-800 transform -translate-x-1/2"
                style={{ left: `${gaugePosition}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>저체중</span>
              <span>정상</span>
              <span>과체중</span>
              <span>비만</span>
            </div>
          </div>

          {/* 정상 체중 범위 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">정상 체중 범위</div>
              <div className="text-lg font-semibold text-gray-800">
                {result.idealWeightRange.min} ~ {result.idealWeightRange.max} kg
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">
                {result.weightDifference > 0 ? "감량 필요" : result.weightDifference < 0 ? "증량 필요" : "현재 상태"}
              </div>
              <div className={`text-lg font-semibold ${
                result.weightDifference > 0 ? "text-red-600" :
                result.weightDifference < 0 ? "text-blue-600" : "text-green-600"
              }`}>
                {result.weightDifference === 0 ? "정상 범위" : `${Math.abs(result.weightDifference)} kg`}
              </div>
            </div>
          </div>

          {/* 건강 위험도 */}
          <div className={`rounded-lg p-3 ${result.categoryBgColor}`}>
            <div className={`text-sm ${result.categoryColor}`}>
              {result.healthRisk}
            </div>
          </div>

          {/* BMI 기준표 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">BMI 기준표 (아시아-태평양)</span>
            </div>
            <div className="divide-y divide-gray-200">
              {Object.entries(BMI_CATEGORIES).map(([key, info]) => (
                <div
                  key={key}
                  className={`px-4 py-2 flex justify-between items-center ${
                    result.category === key ? info.bgColor : ""
                  }`}
                >
                  <span className={`text-sm ${result.category === key ? info.color + " font-medium" : "text-gray-600"}`}>
                    {info.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {info.max === Infinity
                      ? `${info.min} 이상`
                      : `${info.min} ~ ${info.max}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="text-xs text-gray-500">
            <p>* 아시아-태평양 BMI 기준으로 계산됩니다.</p>
            <p>* BMI는 참고용이며, 근육량 등에 따라 달라질 수 있습니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
