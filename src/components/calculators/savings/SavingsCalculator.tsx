"use client";

import { useState, useMemo } from "react";
import { savingsCalculator } from "@/lib/math/savings-calculator";
import type { SavingsInput, SavingsType, InterestType, TaxType } from "@/lib/types/savings";
import { MoneyInput, PercentInput, NumberInput } from "@/components/ui";

const savingsTypes: { value: SavingsType; label: string; description: string }[] = [
  { value: "regular", label: "정기적금", description: "매달 일정액 납입" },
  { value: "lump-sum", label: "정기예금", description: "목돈 일시 예치" },
];

const interestTypes: { value: InterestType; label: string }[] = [
  { value: "simple", label: "단리" },
  { value: "compound", label: "복리" },
];

const taxTypes: { value: TaxType; label: string; rate: string }[] = [
  { value: "normal", label: "일반과세", rate: "15.4%" },
  { value: "preferential", label: "세금우대", rate: "9.5%" },
  { value: "tax-free", label: "비과세", rate: "0%" },
];

export function SavingsCalculator() {
  const [savingsType, setSavingsType] = useState<SavingsType>("regular");
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(500000);
  const [lumpSumDeposit, setLumpSumDeposit] = useState<number>(10000000);
  const [annualRate, setAnnualRate] = useState<number>(4.0);
  const [termMonths, setTermMonths] = useState<number>(12);
  const [interestType, setInterestType] = useState<InterestType>("simple");
  const [taxType, setTaxType] = useState<TaxType>("normal");

  const result = useMemo(() => {
    const rate = annualRate / 100 || 0;

    if (termMonths <= 0) return null;
    if (savingsType === "regular" && monthlyDeposit <= 0) return null;
    if (savingsType === "lump-sum" && lumpSumDeposit <= 0) return null;

    const input: SavingsInput = {
      savingsType,
      monthlyDeposit: monthlyDeposit,
      lumpSumDeposit: lumpSumDeposit,
      annualRate: rate,
      termMonths: termMonths,
      interestType,
      taxType,
    };

    return savingsCalculator.calculate(input);
  }, [savingsType, monthlyDeposit, lumpSumDeposit, annualRate, termMonths, interestType, taxType]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const quickAmounts = savingsType === "regular"
    ? [100000, 300000, 500000, 1000000]
    : [5000000, 10000000, 30000000, 50000000];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        적금/예금 이자 계산기
      </h2>

      {/* 입력 폼 */}
      <div className="space-y-4 mb-6">
        {/* 적금 유형 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품 유형
          </label>
          <div className="grid grid-cols-2 gap-2">
            {savingsTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSavingsType(type.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  savingsType === type.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                <div className="font-medium">{type.label}</div>
                <div className={`text-xs mt-0.5 ${
                  savingsType === type.value ? "text-blue-100" : "text-gray-500"
                }`}>
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 납입금/예치금 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {savingsType === "regular" ? "월 납입금" : "예치금"}
          </label>
          <MoneyInput
            value={savingsType === "regular" ? monthlyDeposit : lumpSumDeposit}
            onChange={(v) => {
              if (savingsType === "regular") {
                setMonthlyDeposit(v);
              } else {
                setLumpSumDeposit(v);
              }
            }}
            step={savingsType === "regular" ? 100000 : 1000000}
            placeholder={savingsType === "regular" ? "월 납입금" : "예치금"}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  if (savingsType === "regular") {
                    setMonthlyDeposit(amount);
                  } else {
                    setLumpSumDeposit(amount);
                  }
                }}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
              >
                {formatCurrency(amount / 10000)}만원
              </button>
            ))}
          </div>
        </div>

        {/* 금리 & 기간 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연이율
            </label>
            <PercentInput
              value={annualRate}
              onChange={setAnnualRate}
              max={20}
              step={0.1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              기간
            </label>
            <NumberInput
              value={termMonths}
              onChange={setTermMonths}
              min={1}
              max={60}
              step={1}
              format="none"
              suffix="개월"
            />
          </div>
        </div>

        {/* 이자 계산 방식 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이자 계산 방식
          </label>
          <div className="flex gap-2">
            {interestTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setInterestType(type.value)}
                className={`flex-1 px-4 py-2 text-sm rounded-lg border transition-colors ${
                  interestType === type.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 세금 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            과세 유형
          </label>
          <div className="grid grid-cols-3 gap-2">
            {taxTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setTaxType(type.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  taxType === type.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                <div className="font-medium">{type.label}</div>
                <div className={`text-xs ${
                  taxType === type.value ? "text-blue-100" : "text-gray-500"
                }`}>
                  {type.rate}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          {/* 만기 수령액 */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-90 mb-1">만기 수령액</div>
            <div className="text-2xl font-bold">
              {formatCurrency(result.maturityAmount)}원
            </div>
            <div className="text-sm opacity-80 mt-1">
              세후 이자: {formatCurrency(result.netInterest)}원
            </div>
          </div>

          {/* 요약 정보 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">총 납입금</div>
              <div className="text-lg font-semibold text-gray-800">
                {formatCurrency(result.totalDeposit)}원
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">세전 이자</div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(result.totalInterest)}원
              </div>
            </div>
          </div>

          {/* 세금 정보 */}
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">이자소득세</span>
              <span className="font-medium text-gray-800">
                -{formatCurrency(result.tax)}원
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {result.summary.taxType}
            </div>
          </div>

          {/* 실질 수익률 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">실질 수익률 (연환산)</span>
              <span className="font-medium text-blue-600">
                {(result.effectiveRate * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* 계산 공식 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-medium">정기적금 (단리)</p>
              <p>• 이자 = 월납입금 × 이율 × (n+1)/24</p>
              <p className="font-medium mt-1">정기예금 (단리)</p>
              <p>• 이자 = 원금 × 이율 × (기간/12)</p>
              <p className="font-medium mt-1">세금</p>
              <p>• 이자소득세: 일반 15.4%, 세금우대 9.5%, 비과세 0%</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">* 실제 이자는 은행별 계산 방식에 따라 다를 수 있음</p>
          </div>
        </div>
      )}
    </div>
  );
}
