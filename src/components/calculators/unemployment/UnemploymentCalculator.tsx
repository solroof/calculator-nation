"use client";

import { useState } from 'react';
import { unemploymentCalculator } from '@/lib/math/unemployment-calculator';
import type { UnemploymentResult } from '@/lib/types/unemployment';
import { NumberInput, MoneyInput } from '@/components/ui';

function formatWon(num: number): string {
  return num.toLocaleString('ko-KR') + '원';
}

export function UnemploymentCalculator() {
  const [age, setAge] = useState<number>(35);
  const [isDisabled, setIsDisabled] = useState(false);
  const [insuranceYears, setInsuranceYears] = useState<number>(3);
  const [avgMonthlyWage, setAvgMonthlyWage] = useState<number>(3000000);
  const [result, setResult] = useState<UnemploymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    const years = insuranceYears || 0;
    if (years < 1) {
      setError('고용보험 가입기간이 1년 이상이어야 실업급여 수급 가능합니다.');
      return;
    }

    const calcResult = unemploymentCalculator.calculate({
      age: age || 35,
      isDisabled,
      insuranceYears: years,
      avgMonthlyWage: avgMonthlyWage || 0,
    });

    setResult(calcResult);
  };

  return (
    <div id="unemployment" className="scroll-mt-20">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">실업급여 계산기</h2>
          <p className="text-xs text-gray-500">고용보험 기반 예상 수급액</p>
        </div>
        <span className="text-2xl">📋</span>
      </div>

      {/* 입력 폼 */}
      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
            <NumberInput
              value={age}
              onChange={setAge}
              min={18}
              max={65}
              step={1}
              format="none"
              suffix="세"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가입기간 (년)</label>
            <NumberInput
              value={insuranceYears}
              onChange={setInsuranceYears}
              min={0}
              max={40}
              step={0.5}
              format="none"
              suffix="년"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            퇴직 전 3개월 평균 월급 (세전)
          </label>
          <MoneyInput
            value={avgMonthlyWage}
            onChange={setAvgMonthlyWage}
            min={0}
            step={100000}
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isDisabled}
            onChange={(e) => setIsDisabled(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-500"
          />
          <span className="text-sm text-gray-700">장애인 여부</span>
        </label>
      </div>

      {/* 계산 버튼 */}
      <button
        onClick={handleCalculate}
        className="w-full py-3.5 rounded-xl font-medium text-base bg-blue-500 text-white active:bg-blue-600 shadow-sm transition-all mb-4"
      >
        계산하기
      </button>

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
            <p className="text-purple-100 text-sm mb-1">예상 총 수령액</p>
            <p className="text-3xl font-bold mb-3">{formatWon(result.totalBenefit)}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-purple-200">일 실업급여</p>
                <p className="font-medium">{formatWon(result.dailyBenefit)}</p>
              </div>
              <div>
                <p className="text-purple-200">월 예상 수령액</p>
                <p className="font-medium">{formatWon(result.monthlyBenefit)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">총 지급일수</p>
                <p className="text-xl font-bold text-gray-800">{result.totalDays}일</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">수급기간</p>
                <p className="text-xl font-bold text-gray-800">약 {result.durationMonths}개월</p>
              </div>
            </div>

            {(result.details.isMinApplied || result.details.isMaxApplied) && (
              <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-700">
                  {result.details.isMinApplied && '※ 최저 일액이 적용되었습니다.'}
                  {result.details.isMaxApplied && '※ 상한액이 적용되었습니다.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 일 실업급여 = 퇴직 전 3개월 평균임금 ÷ 90일 × 60%</p>
          <p>• 상한액: 66,000원/일, 하한액: 최저임금 × 80% × 8시간</p>
          <p>• 총 수령액 = 일 실업급여 × 소정급여일수</p>
          <p>• 소정급여일수: 나이/장애 여부 + 가입기간에 따라 120~270일</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">2024년 고용보험법 기준</p>
      </div>
    </div>
  );
}
