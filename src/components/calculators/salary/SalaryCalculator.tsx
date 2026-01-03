"use client";

import { useState } from 'react';
import { salaryCalculator } from '@/lib/math/salary-calculator';
import type { SalaryInput, SalaryResult } from '@/lib/types/salary';

function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

function formatWon(num: number): string {
  return num.toLocaleString('ko-KR') + '원';
}

export function SalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState<string>('50000000');
  const [dependents, setDependents] = useState<string>('1');
  const [childrenUnder20, setChildrenUnder20] = useState<string>('0');
  const [meals, setMeals] = useState<string>('0');
  const [showDetail, setShowDetail] = useState(false);
  const [result, setResult] = useState<SalaryResult | null>(null);

  const handleCalculate = () => {
    const input: SalaryInput = {
      annualSalary: parseInt(annualSalary.replace(/,/g, '')) || 0,
      dependents: parseInt(dependents) || 1,
      childrenUnder20: parseInt(childrenUnder20) || 0,
      taxExempt: {
        meals: parseInt(meals) || 0,
      },
    };

    const calcResult = salaryCalculator.calculate(input);
    setResult(calcResult);
  };

  const handleSalaryChange = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    setAnnualSalary(num);
  };

  const quickSalaries = [3000, 4000, 5000, 6000, 7000, 8000, 10000];

  return (
    <div id="salary" className="scroll-mt-20">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">연봉 실수령액 계산기</h2>
          <p className="text-xs text-gray-500">4대보험 + 소득세 공제 후 실수령액</p>
        </div>
        <span className="text-2xl">💰</span>
      </div>

      {/* 빠른 선택 */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">빠른 선택</p>
        <div className="flex flex-wrap gap-2">
          {quickSalaries.map((salary) => (
            <button
              key={salary}
              onClick={() => setAnnualSalary((salary * 10000).toString())}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                parseInt(annualSalary) === salary * 10000
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {salary >= 10000 ? `${salary / 10000}억` : `${salary / 1000}천만`}
            </button>
          ))}
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            연봉 (세전)
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatNumber(parseInt(annualSalary) || 0)}
              onChange={(e) => handleSalaryChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50,000,000"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              부양가족 수 (본인 포함)
            </label>
            <select
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}명</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              20세 이하 자녀
            </label>
            <select
              value={childrenUnder20}
              onChange={(e) => setChildrenUnder20(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}명</option>
              ))}
            </select>
          </div>
        </div>

        {/* 비과세 옵션 */}
        <div>
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {showDetail ? '▼' : '▶'} 비과세 항목 설정
          </button>
          {showDetail && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl">
              <label className="block text-sm text-gray-600 mb-1">
                식대 (월 최대 20만원 비과세)
              </label>
              <input
                type="number"
                value={meals}
                onChange={(e) => setMeals(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="0"
                max={200000}
              />
            </div>
          )}
        </div>
      </div>

      {/* 계산 버튼 */}
      <button
        onClick={handleCalculate}
        className="w-full py-3.5 rounded-xl font-medium text-base bg-blue-500 text-white active:bg-blue-600 shadow-sm transition-all mb-4"
      >
        계산하기
      </button>

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          {/* 핵심 결과 */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
            <p className="text-blue-100 text-sm mb-1">월 실수령액</p>
            <p className="text-3xl font-bold mb-3">
              {formatWon(result.monthlyNetSalary)}
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-blue-100">연 실수령액</span>
              <span className="font-medium">{formatWon(result.annualNetSalary)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-blue-100">실수령 비율</span>
              <span className="font-medium">{result.netRate}%</span>
            </div>
          </div>

          {/* 월별 공제 내역 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <p className="font-medium text-gray-800">월별 공제 내역</p>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-600">월 급여 (세전)</span>
                <span className="font-medium">{formatWon(result.monthlySalary)}</span>
              </div>

              <div className="px-4 py-2 bg-gray-50">
                <p className="text-xs font-medium text-gray-500">4대보험</p>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600 text-sm">국민연금</span>
                <span className="text-red-500 text-sm">-{formatWon(result.deductions.nationalPension)}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600 text-sm">건강보험</span>
                <span className="text-red-500 text-sm">-{formatWon(result.deductions.healthInsurance)}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600 text-sm">장기요양보험</span>
                <span className="text-red-500 text-sm">-{formatWon(result.deductions.longTermCare)}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600 text-sm">고용보험</span>
                <span className="text-red-500 text-sm">-{formatWon(result.deductions.employmentInsurance)}</span>
              </div>

              <div className="px-4 py-2 bg-gray-50">
                <p className="text-xs font-medium text-gray-500">세금</p>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600 text-sm">소득세</span>
                <span className="text-red-500 text-sm">-{formatWon(result.deductions.incomeTax)}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-gray-600 text-sm">지방소득세</span>
                <span className="text-red-500 text-sm">-{formatWon(result.deductions.localIncomeTax)}</span>
              </div>

              <div className="flex justify-between px-4 py-3 bg-red-50">
                <span className="font-medium text-gray-800">총 공제액</span>
                <span className="font-bold text-red-600">-{formatWon(result.deductions.totalDeduction)}</span>
              </div>
              <div className="flex justify-between px-4 py-3 bg-blue-50">
                <span className="font-medium text-gray-800">월 실수령액</span>
                <span className="font-bold text-blue-600">{formatWon(result.monthlyNetSalary)}</span>
              </div>
            </div>
          </div>

          {/* 연간 요약 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-800 mb-3">연간 요약</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-500 text-xs">연봉 (세전)</p>
                <p className="font-bold text-gray-800">{formatWon(result.annualSalary)}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-500 text-xs">연 공제액</p>
                <p className="font-bold text-red-500">-{formatWon(result.annualDeductions.total)}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-500 text-xs">연 실수령액</p>
                <p className="font-bold text-blue-600">{formatWon(result.annualNetSalary)}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-500 text-xs">공제율</p>
                <p className="font-bold text-gray-800">{result.deductionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 py-4 text-center text-gray-400 text-xs border-t border-gray-100">
        <p>2024년 기준 · 간이세액표 적용</p>
        <p className="mt-1">실제 금액과 차이가 있을 수 있습니다</p>
      </div>
    </div>
  );
}
