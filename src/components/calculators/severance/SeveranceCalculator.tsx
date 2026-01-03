"use client";

import { useState } from 'react';
import { severanceCalculator } from '@/lib/math/severance-calculator';
import type { SeveranceResult } from '@/lib/types/severance';

function formatWon(num: number): string {
  return num.toLocaleString('ko-KR') + '원';
}

export function SeveranceCalculator() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [salary1, setSalary1] = useState<string>('3000000');
  const [salary2, setSalary2] = useState<string>('3000000');
  const [salary3, setSalary3] = useState<string>('3000000');
  const [annualBonus, setAnnualBonus] = useState<string>('0');
  const [annualAllowance, setAnnualAllowance] = useState<string>('0');
  const [showDetail, setShowDetail] = useState(false);
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    if (!startDate || !endDate) {
      setError('입사일과 퇴사일을 입력해주세요.');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('퇴사일은 입사일보다 이후여야 합니다.');
      return;
    }

    const recentSalaries = [
      parseInt(salary1.replace(/,/g, '')) || 0,
      parseInt(salary2.replace(/,/g, '')) || 0,
      parseInt(salary3.replace(/,/g, '')) || 0,
    ];

    if (recentSalaries.some(s => s <= 0)) {
      setError('최근 3개월 급여를 입력해주세요.');
      return;
    }

    const calcResult = severanceCalculator.calculate({
      startDate,
      endDate,
      recentSalaries,
      annualBonus: parseInt(annualBonus.replace(/,/g, '')) || 0,
      annualAllowance: parseInt(annualAllowance.replace(/,/g, '')) || 0,
    });

    setResult(calcResult);
  };

  const formatNumber = (value: string, setter: (v: string) => void) => {
    const num = value.replace(/[^0-9]/g, '');
    setter(num);
  };

  // 오늘 날짜
  const today = new Date().toISOString().split('T')[0];

  return (
    <div id="severance" className="scroll-mt-20">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">퇴직금 계산기</h2>
          <p className="text-xs text-gray-500">근속기간, 평균임금 기반 계산</p>
        </div>
        <span className="text-2xl">💼</span>
      </div>

      {/* 입력 폼 */}
      <div className="space-y-4 mb-4">
        {/* 날짜 입력 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">입사일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={today}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">퇴사일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={today}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 최근 3개월 급여 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            최근 3개월 급여 (세전)
          </label>
          <div className="space-y-2">
            {[
              { label: '1개월 전', value: salary1, setter: setSalary1 },
              { label: '2개월 전', value: salary2, setter: setSalary2 },
              { label: '3개월 전', value: salary3, setter: setSalary3 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-16">{item.label}</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={parseInt(item.value || '0').toLocaleString()}
                    onChange={(e) => formatNumber(e.target.value, item.setter)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 옵션 */}
        <div>
          <button
            onClick={() => setShowDetail(!showDetail)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {showDetail ? '▼' : '▶'} 상여금/수당 입력
          </button>
          {showDetail && (
            <div className="mt-2 p-3 bg-gray-50 rounded-xl space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">연간 상여금 (총액)</label>
                <input
                  type="text"
                  value={parseInt(annualBonus || '0').toLocaleString()}
                  onChange={(e) => formatNumber(e.target.value, setAnnualBonus)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">연간 수당 (총액)</label>
                <input
                  type="text"
                  value={parseInt(annualAllowance || '0').toLocaleString()}
                  onChange={(e) => formatNumber(e.target.value, setAnnualAllowance)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="0"
                />
              </div>
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

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          {/* 핵심 결과 */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
            <p className="text-green-100 text-sm mb-1">예상 퇴직금</p>
            <p className="text-3xl font-bold mb-3">
              {formatWon(result.severancePay)}
            </p>
            <div className="text-sm text-green-100">
              <p>근속기간: {result.years}년 {result.months}개월 {result.days}일</p>
              <p className="text-xs mt-1 opacity-80">({result.totalDays.toLocaleString()}일)</p>
            </div>
          </div>

          {/* 계산 과정 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <p className="font-medium text-gray-800">계산 과정</p>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-600">최근 3개월 급여 합계</span>
                <span className="font-medium">{formatWon(result.details.recentSalaryTotal)}</span>
              </div>
              {result.details.bonusRatio > 0 && (
                <div className="flex justify-between px-4 py-3">
                  <span className="text-gray-600">상여금 비례액 (3개월)</span>
                  <span className="font-medium">+{formatWon(result.details.bonusRatio)}</span>
                </div>
              )}
              {result.details.allowanceRatio > 0 && (
                <div className="flex justify-between px-4 py-3">
                  <span className="text-gray-600">수당 비례액 (3개월)</span>
                  <span className="font-medium">+{formatWon(result.details.allowanceRatio)}</span>
                </div>
              )}
              <div className="flex justify-between px-4 py-3 bg-gray-50">
                <span className="font-medium text-gray-800">3개월 총 임금</span>
                <span className="font-bold">{formatWon(result.details.totalWage)}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-600">3개월 총 일수</span>
                <span className="font-medium">{result.details.avgDays}일</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-600">1일 평균임금</span>
                <span className="font-medium">{formatWon(result.avgDailySalary)}</span>
              </div>
              <div className="px-4 py-3 bg-blue-50">
                <p className="text-xs text-gray-500 mb-1">계산식</p>
                <p className="text-sm font-medium text-blue-700">{result.severanceFormula}</p>
              </div>
            </div>
          </div>

          {/* 안내 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              <strong>참고:</strong> 1년 미만 근무 시에도 근무일수에 비례하여 퇴직금이 지급됩니다.
              실제 퇴직금은 회사 규정에 따라 다를 수 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 py-4 text-center text-gray-400 text-xs border-t border-gray-100">
        <p>근로기준법 기준 · 평균임금 산정</p>
      </div>
    </div>
  );
}
