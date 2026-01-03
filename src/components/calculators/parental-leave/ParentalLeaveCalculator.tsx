"use client";

import { useState, useMemo } from "react";
import { parentalLeaveCalculator } from "@/lib/math/parental-leave-calculator";
import type { ParentalLeaveInput } from "@/lib/types/parental-leave";

export function ParentalLeaveCalculator() {
  const [monthlyWage, setMonthlyWage] = useState<string>("3000000");
  const [leaveDurationMonths, setLeaveDurationMonths] = useState<string>("12");
  const [isSixPlusSix, setIsSixPlusSix] = useState<boolean>(false);

  const result = useMemo(() => {
    const wage = parseInt(monthlyWage) || 0;
    const duration = parseInt(leaveDurationMonths) || 0;

    if (wage <= 0 || duration <= 0) return null;

    const input: ParentalLeaveInput = {
      monthlyWage: wage,
      leaveDurationMonths: Math.min(duration, 12),
      isSixPlusSix,
    };

    return parentalLeaveCalculator.calculate(input);
  }, [monthlyWage, leaveDurationMonths, isSixPlusSix]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const quickWages = [2500000, 3000000, 3500000, 4000000, 5000000];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        육아휴직 급여 계산기
      </h2>

      {/* 입력 폼 */}
      <div className="space-y-4 mb-6">
        {/* 통상임금 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            통상임금 (월)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={monthlyWage}
            onChange={(e) => setMonthlyWage(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right text-lg"
            placeholder="3,000,000"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {quickWages.map((wage) => (
              <button
                key={wage}
                onClick={() => setMonthlyWage(wage.toString())}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
              >
                {formatCurrency(wage / 10000)}만원
              </button>
            ))}
          </div>
        </div>

        {/* 휴직 기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            휴직 기간 (개월)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="1"
              max="12"
              value={leaveDurationMonths || 12}
              onChange={(e) => setLeaveDurationMonths(e.target.value)}
              className="flex-1"
            />
            <span className="w-16 text-center text-lg font-medium text-gray-800">
              {leaveDurationMonths}개월
            </span>
          </div>
        </div>

        {/* 6+6 부모 동시 육휴 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isSixPlusSix}
              onChange={(e) => setIsSixPlusSix(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-800">6+6 부모 동시 육휴</span>
              <p className="text-xs text-gray-500 mt-1">
                부모 모두 육아휴직 사용 시 첫 6개월 통상임금 100% 지급 (최대 450만원)
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          {/* 총 수령액 */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-90 mb-1">총 예상 수령액</div>
            <div className="text-2xl font-bold">
              {formatCurrency(result.totalBenefit)}원
            </div>
            <div className="text-sm opacity-80 mt-1">
              월 평균 {formatCurrency(result.avgMonthlyBenefit)}원
            </div>
          </div>

          {/* 기간별 요약 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">
                {isSixPlusSix ? "6+6 기간 (1~6개월)" : "첫 3개월"}
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {formatCurrency(result.first3MonthsTotal)}원
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">
                {isSixPlusSix ? "7개월 이후" : "4개월 이후"}
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {formatCurrency(result.after3MonthsTotal)}원
              </div>
            </div>
          </div>

          {/* 월별 상세 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">월별 급여 상세</span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">개월</th>
                    <th className="px-4 py-2 text-right text-gray-600">급여</th>
                    <th className="px-4 py-2 text-right text-gray-600">지급률</th>
                  </tr>
                </thead>
                <tbody>
                  {result.monthlyBenefits.map((benefit) => (
                    <tr key={benefit.month} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-gray-800">{benefit.month}개월</td>
                      <td className="px-4 py-2 text-right font-medium text-gray-800">
                        {formatCurrency(benefit.amount)}원
                      </td>
                      <td className="px-4 py-2 text-right text-gray-500">
                        {Math.round(benefit.rate * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>* 2024년 육아휴직 급여 기준으로 계산됩니다.</p>
            <p>* 첫 3개월: 통상임금 80% (상한 150만원, 하한 70만원)</p>
            <p>* 4~12개월: 통상임금 50% (상한 120만원, 하한 70만원)</p>
            <p>* 6+6 육휴: 첫 6개월 100% (최대 450만원)</p>
          </div>
        </div>
      )}
    </div>
  );
}
