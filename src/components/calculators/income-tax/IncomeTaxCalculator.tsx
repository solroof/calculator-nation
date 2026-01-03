"use client";

import { useState } from "react";

// 2024년 종합소득세율
const taxBrackets = [
  { min: 0, max: 14000000, rate: 6, deduction: 0 },
  { min: 14000000, max: 50000000, rate: 15, deduction: 1260000 },
  { min: 50000000, max: 88000000, rate: 24, deduction: 5760000 },
  { min: 88000000, max: 150000000, rate: 35, deduction: 15440000 },
  { min: 150000000, max: 300000000, rate: 38, deduction: 19940000 },
  { min: 300000000, max: 500000000, rate: 40, deduction: 25940000 },
  { min: 500000000, max: 1000000000, rate: 42, deduction: 35940000 },
  { min: 1000000000, max: Infinity, rate: 45, deduction: 65940000 },
];

export function IncomeTaxCalculator() {
  const [income, setIncome] = useState("50000000");
  const [expenses, setExpenses] = useState("0");
  const [deductions, setDeductions] = useState("1500000");

  const calculate = () => {
    const totalIncome = parseFloat(income) || 0;
    const totalExpenses = parseFloat(expenses) || 0;
    const totalDeductions = parseFloat(deductions) || 0;

    // 과세표준 = 소득 - 필요경비 - 소득공제
    const taxableIncome = Math.max(0, totalIncome - totalExpenses - totalDeductions);

    // 세율 적용
    let incomeTax = 0;
    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min) {
        incomeTax = taxableIncome * (bracket.rate / 100) - bracket.deduction;
        if (taxableIncome <= bracket.max) break;
      }
    }

    // 지방소득세 (10%)
    const localTax = incomeTax * 0.1;
    const totalTax = incomeTax + localTax;

    // 실효세율
    const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;

    return {
      totalIncome,
      taxableIncome,
      incomeTax: Math.round(incomeTax),
      localTax: Math.round(localTax),
      totalTax: Math.round(totalTax),
      effectiveRate,
      netIncome: Math.round(totalIncome - totalTax),
    };
  };

  const result = calculate();

  // 현재 세율 구간 찾기
  const getCurrentBracket = () => {
    for (const bracket of taxBrackets) {
      if (result.taxableIncome <= bracket.max) {
        return bracket.rate;
      }
    }
    return 45;
  };

  return (
    <div id="income-tax" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">종합소득세 계산기</h2>
          <p className="text-xs text-gray-500">프리랜서/사업소득 세금</p>
        </div>
        <span className="text-2xl">📋</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">연간 총수입 (원)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="50000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">필요경비 (원)</label>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          <p className="text-xs text-gray-400 mt-1">사업 관련 지출 비용</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">소득공제 (원)</label>
          <input
            type="number"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            placeholder="1500000"
          />
          <p className="text-xs text-gray-400 mt-1">기본공제 150만원 + 추가공제</p>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">납부할 세금</p>
            <p className="text-2xl font-bold">{result.totalTax.toLocaleString()}원</p>
            <p className="text-white/50 text-xs">실효세율 {result.effectiveRate.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">세후 소득</p>
            <p className="text-2xl font-bold">{result.netIncome.toLocaleString()}원</p>
            <p className="text-white/50 text-xs">적용세율 {getCurrentBracket()}%</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">과세표준</span>
          <span className="font-medium">{result.taxableIncome.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">소득세</span>
          <span className="font-medium">{result.incomeTax.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">지방소득세 (10%)</span>
          <span className="font-medium">{result.localTax.toLocaleString()}원</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl">
        <p className="text-sm font-medium text-blue-800 mb-2">2024년 종합소득세율</p>
        <div className="text-xs text-gray-600 space-y-1">
          <p>1,400만 이하: 6% | ~5,000만: 15%</p>
          <p>~8,800만: 24% | ~1.5억: 35%</p>
          <p>~3억: 38% | ~5억: 40% | ~10억: 42% | 10억 초과: 45%</p>
        </div>
      </div>
    </div>
  );
}
