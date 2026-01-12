"use client";

import { useState } from 'react';
import { salaryCalculator } from '@/lib/math/salary-calculator';
import type { SalaryInput, SalaryResult } from '@/lib/types/salary';
import { MoneyInput, NumberInput } from "@/components/ui";

function formatWon(num: number): string {
  return num.toLocaleString('ko-KR') + '원';
}

export function SalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState<number>(50000000);
  const [dependents, setDependents] = useState<number>(1);
  const [childrenUnder20, setChildrenUnder20] = useState<number>(0);
  const [meals, setMeals] = useState<number>(0);
  const [showDetail, setShowDetail] = useState(false);
  const [result, setResult] = useState<SalaryResult | null>(null);

  const handleCalculate = () => {
    const input: SalaryInput = {
      annualSalary: annualSalary || 0,
      dependents: dependents || 1,
      childrenUnder20: childrenUnder20 || 0,
      taxExempt: {
        meals: meals || 0,
      },
    };

    const calcResult = salaryCalculator.calculate(input);
    setResult(calcResult);
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
              onClick={() => setAnnualSalary(salary * 10000)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                annualSalary === salary * 10000
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
          <MoneyInput
            value={annualSalary}
            onChange={setAnnualSalary}
            step={1000000}
            min={0}
            placeholder="연봉 입력"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              부양가족 수 (본인 포함)
            </label>
            <NumberInput
              value={dependents}
              onChange={setDependents}
              min={1}
              max={10}
              step={1}
              format="none"
              suffix="명"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              20세 이하 자녀
            </label>
            <NumberInput
              value={childrenUnder20}
              onChange={setChildrenUnder20}
              min={0}
              max={10}
              step={1}
              format="none"
              suffix="명"
            />
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
              <MoneyInput
                value={meals}
                onChange={setMeals}
                max={200000}
                step={10000}
                placeholder="0"
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

      {/* 계산 공식 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 월 급여 = 연봉 ÷ 12</p>
          <p>• 실수령액 = 월 급여 - 4대보험 - 세금</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">4대보험 요율 (2024년, 근로자 부담분)</p>
          <p>국민연금: 4.5% | 건강보험: 3.545%</p>
          <p>장기요양: 건강보험 × 12.95% | 고용보험: 0.9%</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">간이세액표 적용 · 실제 금액과 다를 수 있음</p>
      </div>
    </div>
  );
}
