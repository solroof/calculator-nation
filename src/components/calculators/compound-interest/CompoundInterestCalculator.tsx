"use client";

import { useState } from "react";
import { MoneyInput, PercentInput, NumberInput } from "@/components/ui";

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(5);
  const [years, setYears] = useState<number>(10);
  const [compoundFreq, setCompoundFreq] = useState("12");

  const calculate = () => {
    const P = principal;
    const r = rate / 100;
    const t = years;
    const n = parseFloat(compoundFreq);

    if (P <= 0 || t <= 0 || n <= 0) return null;

    const amount = P * Math.pow(1 + r / n, n * t);
    const totalInterest = amount - P;
    const simpleInterest = P * r * t;

    return {
      finalAmount: amount,
      totalInterest,
      simpleInterest,
      compoundBenefit: totalInterest - simpleInterest,
    };
  };

  const result = calculate();
  const formatWon = (num: number) => Math.round(num).toLocaleString("ko-KR") + "원";

  const freqOptions = [
    { value: "1", label: "연 1회" },
    { value: "2", label: "반기 (연 2회)" },
    { value: "4", label: "분기 (연 4회)" },
    { value: "12", label: "월 (연 12회)" },
    { value: "365", label: "일 (연 365회)" },
  ];

  return (
    <div id="compound-interest" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">복리 계산기</h2>
          <p className="text-xs text-gray-500">복리 이자로 투자 성장 계산</p>
        </div>
        <span className="text-2xl">📊</span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">초기 투자금</label>
          <MoneyInput
            value={principal}
            onChange={setPrincipal}
            step={1000000}
            placeholder="투자금 입력"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연 이율</label>
            <PercentInput
              value={rate}
              onChange={setRate}
              max={50}
              step={0.5}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">투자 기간</label>
            <NumberInput
              value={years}
              onChange={setYears}
              min={1}
              max={50}
              step={1}
              format="none"
              suffix="년"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">복리 주기</label>
          <select
            value={compoundFreq}
            onChange={(e) => setCompoundFreq(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
          >
            {freqOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
            <p className="text-white/80 text-sm mb-1">최종 금액</p>
            <p className="text-3xl font-bold">{formatWon(result.finalAmount)}</p>
            <p className="text-white/70 text-sm mt-2">
              {years}년 후 예상 금액
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">원금</span>
              <span className="font-medium">{formatWon(principal)}</span>
            </div>
            <div className="flex justify-between text-violet-600">
              <span>복리 이자</span>
              <span className="font-medium">+{formatWon(result.totalInterest)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-800">최종 금액</span>
              <span className="font-bold">{formatWon(result.finalAmount)}</span>
            </div>
          </div>

          <div className="bg-violet-50 rounded-xl p-4">
            <p className="text-sm text-violet-700">
              <strong>복리 효과:</strong> 단리 대비 <strong>{formatWon(result.compoundBenefit)}</strong> 더 받습니다
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 복리: A = P × (1 + r/n)^(n×t)</p>
              <p>• 단리: A = P × (1 + r×t)</p>
              <p className="pl-3 mt-1">P: 원금, r: 연이율, n: 복리 주기, t: 기간(년)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
