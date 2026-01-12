"use client";

import { useState, useMemo } from "react";
import { rentConversionCalculator } from "@/lib/math/rent-conversion-calculator";
import { RENT_CONVERSION_2024 } from "@/lib/types/rent-conversion";
import type { RentConversionInput, ConversionDirection } from "@/lib/types/rent-conversion";

export function RentConversionCalculator() {
  const [direction, setDirection] = useState<ConversionDirection>("jeonse-to-monthly");
  const [jeonseDeposit, setJeonseDeposit] = useState<string>("300000000");
  const [convertAmount, setConvertAmount] = useState<string>("100000000");
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>("50000000");
  const [monthlyRent, setMonthlyRent] = useState<string>("500000");
  const [useCustomRate, setUseCustomRate] = useState<boolean>(false);
  const [customRate, setCustomRate] = useState<string>("5.5");

  const result = useMemo(() => {
    const input: RentConversionInput = {
      direction,
      jeonseDeposit: parseInt(jeonseDeposit) || 0,
      convertAmount: parseInt(convertAmount) || 0,
      monthlyDeposit: parseInt(monthlyDeposit) || 0,
      monthlyRent: parseInt(monthlyRent) || 0,
      conversionRate: parseFloat(customRate) / 100 || RENT_CONVERSION_2024.legalConversionRate,
      useCustomRate,
    };

    if (direction === "jeonse-to-monthly") {
      if (!input.jeonseDeposit || !input.convertAmount) return null;
    } else {
      if (!input.monthlyRent) return null;
    }

    return rentConversionCalculator.calculate(input);
  }, [direction, jeonseDeposit, convertAmount, monthlyDeposit, monthlyRent, useCustomRate, customRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const quickDeposits = [100000000, 200000000, 300000000, 500000000];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        전월세 전환 계산기
      </h2>

      {/* 전환 방향 선택 */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setDirection("jeonse-to-monthly")}
            className={`flex-1 px-4 py-3 text-sm rounded-lg border transition-colors ${
              direction === "jeonse-to-monthly"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
            }`}
          >
            전세 → 월세
          </button>
          <button
            onClick={() => setDirection("monthly-to-jeonse")}
            className={`flex-1 px-4 py-3 text-sm rounded-lg border transition-colors ${
              direction === "monthly-to-jeonse"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
            }`}
          >
            월세 → 전세
          </button>
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="space-y-4 mb-6">
        {direction === "jeonse-to-monthly" ? (
          <>
            {/* 전세 보증금 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 전세 보증금
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={jeonseDeposit}
                onChange={(e) => setJeonseDeposit(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right text-lg"
                placeholder="300,000,000"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {quickDeposits.map((deposit) => (
                  <button
                    key={deposit}
                    onClick={() => setJeonseDeposit(deposit.toString())}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
                  >
                    {formatCurrency(deposit / 100000000)}억
                  </button>
                ))}
              </div>
            </div>

            {/* 전환할 금액 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전환할 금액 (보증금 감소분)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right text-lg"
                placeholder="100,000,000"
              />
              <p className="text-xs text-gray-500 mt-1">
                이 금액만큼 보증금이 줄어들고 월세로 전환됩니다
              </p>
            </div>
          </>
        ) : (
          <>
            {/* 현재 월세 보증금 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 월세 보증금
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right text-lg"
                placeholder="50,000,000"
              />
            </div>

            {/* 현재 월세 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 월세
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right text-lg"
                placeholder="500,000"
              />
            </div>
          </>
        )}

        {/* 전환율 설정 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={useCustomRate}
              onChange={(e) => setUseCustomRate(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-800">사용자 지정 전환율</span>
              <p className="text-xs text-gray-500 mt-1">
                법정 전환율: {(RENT_CONVERSION_2024.legalConversionRate * 100).toFixed(1)}%
                (기준금리 {(RENT_CONVERSION_2024.baseRate * 100).toFixed(1)}% + 2%)
              </p>
            </div>
          </label>
          {useCustomRate && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value.replace(/[^0-9.]/g, ""))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right"
                placeholder="5.5"
              />
              <span className="text-gray-600">%</span>
              <span className="text-xs text-gray-500">(최대 10%)</span>
            </div>
          )}
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          {/* 전환 결과 */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            {direction === "jeonse-to-monthly" ? (
              <>
                <div className="text-sm opacity-90 mb-1">전환 후 월세</div>
                <div className="text-2xl font-bold">
                  월 {formatCurrency(result.monthlyRent)}원
                </div>
                <div className="text-sm opacity-80 mt-1">
                  보증금 {formatCurrency(result.newDeposit)}원
                </div>
              </>
            ) : (
              <>
                <div className="text-sm opacity-90 mb-1">전환 후 전세 보증금</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(result.newDeposit)}원
                </div>
                <div className="text-sm opacity-80 mt-1">
                  추가 필요 보증금: {formatCurrency(result.convertedAmount)}원
                </div>
              </>
            )}
          </div>

          {/* 상세 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">적용 전환율</span>
              <span className="font-medium text-gray-800">{result.rateDescription}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">전환 금액</span>
              <span className="font-medium text-gray-800">{formatCurrency(result.convertedAmount)}원</span>
            </div>
            {direction === "jeonse-to-monthly" && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">연간 월세 총액</span>
                <span className="font-medium text-gray-800">{formatCurrency(result.yearlyRent)}원</span>
              </div>
            )}
          </div>

          {/* 2년 비용 비교 */}
          {direction === "jeonse-to-monthly" && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-800 mb-2">2년 비용 비교</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">2년 월세 총액</span>
                  <span className="text-gray-800">{formatCurrency(result.comparison.totalCost2Years)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">보증금 기회비용 (예금 이자)</span>
                  <span className="text-gray-800">{formatCurrency(result.comparison.opportunityCost)}원</span>
                </div>
              </div>
            </div>
          )}

          {/* 계산 공식 */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 월세 = 전환금액 × 전환율 ÷ 12</p>
              <p>• 전세금 = 월세 × 12 ÷ 전환율</p>
              <p>• 법정 전환율 = 기준금리 + 2%</p>
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
              <p className="font-medium mb-1">2024년 기준</p>
              <p>• 한국은행 기준금리: 3.5%</p>
              <p>• 법정 전환율: 5.5% (상한 10%)</p>
              <p>• 실제 계약 시 임대인과 협의 필요</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
