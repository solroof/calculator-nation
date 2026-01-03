"use client";

import { useState, useMemo } from "react";
import { ageCalculator } from "@/lib/math/age-calculator";

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>("1990-01-01");

  const result = useMemo(() => {
    if (!birthDate) return null;
    return ageCalculator.calculate({ birthDate });
  }, [birthDate]);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        만 나이 계산기
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">만 나이</div>
              <div className="text-2xl font-bold text-blue-600">
                {result.internationalAge}세
              </div>
              <div className="text-xs text-gray-500">
                {result.months}개월 {result.days}일
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">한국 나이</div>
              <div className="text-2xl font-bold text-gray-600">
                {result.koreanAge}세
              </div>
              <div className="text-xs text-gray-500">
                (2023년부터 만 나이 사용)
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">태어난 지</span>
              <span className="text-sm font-medium">{result.totalDays.toLocaleString()}일</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">다음 생일까지</span>
              <span className="text-sm font-medium">{result.nextBirthday.daysUntil}일</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">띠</div>
              <div className="text-lg font-semibold text-yellow-700">
                {result.zodiac.element}{result.zodiac.animal}띠
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">별자리</div>
              <div className="text-lg font-semibold text-purple-700">
                {result.constellation}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
