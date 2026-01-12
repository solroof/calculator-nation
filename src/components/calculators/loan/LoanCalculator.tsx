"use client";

import { useState, useMemo } from "react";
import { loanCalculator } from "@/lib/math/loan-calculator";
import type { LoanInput, RepaymentType } from "@/lib/types/loan";
import { MoneyInput, PercentInput, NumberInput } from "@/components/ui";

const repaymentTypes: { value: RepaymentType; label: string; description: string }[] = [
  {
    value: "equal-payment",
    label: "원리금균등",
    description: "매달 동일 금액 상환",
  },
  {
    value: "equal-principal",
    label: "원금균등",
    description: "원금 동일, 이자 감소",
  },
  {
    value: "bullet",
    label: "만기일시",
    description: "만기에 원금 일시상환",
  },
];

export function LoanCalculator() {
  const [principal, setPrincipal] = useState<number>(100000000);
  const [annualRate, setAnnualRate] = useState<number>(5.0);
  const [termYears, setTermYears] = useState<number>(30);
  const [repaymentType, setRepaymentType] = useState<RepaymentType>("equal-payment");
  const [gracePeriodMonths, setGracePeriodMonths] = useState<number>(0);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = useMemo(() => {
    const rate = annualRate / 100 || 0;
    const months = termYears * 12;

    if (principal <= 0 || months <= 0) return null;

    const input: LoanInput = {
      principal: principal,
      annualRate: rate,
      termMonths: months,
      repaymentType,
      gracePeriodMonths: gracePeriodMonths,
    };

    return loanCalculator.calculate(input);
  }, [principal, annualRate, termYears, repaymentType, gracePeriodMonths]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const quickAmounts = [50000000, 100000000, 200000000, 300000000, 500000000];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        대출 이자 계산기
      </h2>

      {/* 입력 폼 */}
      <div className="space-y-4 mb-6">
        {/* 대출금액 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            대출금액
          </label>
          <MoneyInput
            value={principal}
            onChange={setPrincipal}
            step={10000000}
            min={0}
            placeholder="대출금액 입력"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setPrincipal(amount)}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
              >
                {amount >= 100000000
                  ? `${formatCurrency(amount / 100000000)}억`
                  : `${formatCurrency(amount / 10000)}만`}
              </button>
            ))}
          </div>
        </div>

        {/* 대출금리 & 대출기간 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연이율
            </label>
            <PercentInput
              value={annualRate}
              onChange={setAnnualRate}
              min={0}
              max={30}
              step={0.1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              대출기간
            </label>
            <NumberInput
              value={termYears}
              onChange={setTermYears}
              min={1}
              max={50}
              step={1}
              format="none"
              suffix="년"
            />
          </div>
        </div>

        {/* 상환방식 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상환방식
          </label>
          <div className="grid grid-cols-3 gap-2">
            {repaymentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setRepaymentType(type.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  repaymentType === type.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                <div className="font-medium">{type.label}</div>
                <div className={`text-xs mt-0.5 ${
                  repaymentType === type.value ? "text-blue-100" : "text-gray-500"
                }`}>
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 거치기간 (원금균등, 원리금균등만) */}
        {repaymentType !== "bullet" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거치기간
            </label>
            <NumberInput
              value={gracePeriodMonths}
              onChange={setGracePeriodMonths}
              min={0}
              max={60}
              step={1}
              format="none"
              suffix="개월"
            />
            <p className="text-xs text-gray-500 mt-1">
              거치기간 동안은 이자만 납부합니다
            </p>
          </div>
        )}
      </div>

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          {/* 월 납입금 */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-90 mb-1">
              {repaymentType === "equal-payment" ? "월 납입금" : "첫 달 납입금"}
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(result.summary.firstMonthPayment)}원
            </div>
            {repaymentType !== "equal-payment" && (
              <div className="text-sm opacity-80 mt-1">
                마지막 달: {formatCurrency(result.summary.lastMonthPayment)}원
              </div>
            )}
          </div>

          {/* 요약 정보 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">총 이자</div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(result.summary.totalInterest)}원
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">총 상환금액</div>
              <div className="text-lg font-semibold text-gray-800">
                {formatCurrency(result.summary.totalPayment)}원
              </div>
            </div>
          </div>

          {/* 상환 스케줄 토글 */}
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
          >
            {showSchedule ? "상환 스케줄 숨기기" : "상환 스케줄 보기"}
            <svg
              className={`w-4 h-4 transition-transform ${showSchedule ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 상환 스케줄 */}
          {showSchedule && (
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">상환 스케줄</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-600">회차</th>
                      <th className="px-3 py-2 text-right text-gray-600">원금</th>
                      <th className="px-3 py-2 text-right text-gray-600">이자</th>
                      <th className="px-3 py-2 text-right text-gray-600">납입금</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.monthlyPayments.slice(0, 60).map((payment) => (
                      <tr key={payment.month} className="border-t border-gray-200">
                        <td className="px-3 py-2 text-gray-800">{payment.month}회</td>
                        <td className="px-3 py-2 text-right text-gray-600">
                          {formatCurrency(payment.principal)}
                        </td>
                        <td className="px-3 py-2 text-right text-red-500">
                          {formatCurrency(payment.interest)}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-gray-800">
                          {formatCurrency(payment.payment)}
                        </td>
                      </tr>
                    ))}
                    {result.monthlyPayments.length > 60 && (
                      <tr className="border-t border-gray-200">
                        <td colSpan={4} className="px-3 py-2 text-center text-gray-500">
                          ... {result.monthlyPayments.length - 60}개 회차 더 있음
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 계산 공식 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium">원리금균등</p>
              <p>• 월 납입금 = P × r × (1+r)ⁿ / [(1+r)ⁿ - 1]</p>
              <p className="font-medium mt-1">원금균등</p>
              <p>• 월 원금 = P / n, 월 이자 = 잔액 × r</p>
              <p className="font-medium mt-1">만기일시</p>
              <p>• 월 이자 = P × r, 만기 시 원금 일시상환</p>
              <p className="pl-3 mt-1">P: 원금, r: 월이율, n: 총 개월수</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">* 실제 대출 조건에 따라 금액이 달라질 수 있음</p>
          </div>
        </div>
      )}
    </div>
  );
}
