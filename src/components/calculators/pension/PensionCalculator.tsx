"use client";

import { useState } from "react";

export function PensionCalculator() {
  const [birthYear, setBirthYear] = useState("1985");
  const [monthlySalary, setMonthlySalary] = useState("350");
  const [workYears, setWorkYears] = useState("30");
  const [expectedRetireAge, setExpectedRetireAge] = useState("65");

  const calculate = () => {
    const birth = parseInt(birthYear);
    const salary = parseInt(monthlySalary) * 10000; // 만원 단위
    const years = parseInt(workYears);
    const retireAge = parseInt(expectedRetireAge);

    if (isNaN(birth) || isNaN(salary) || isNaN(years)) return null;

    // 국민연금 수령 나이 (출생년도에 따라)
    let pensionAge = 65;
    if (birth <= 1952) pensionAge = 60;
    else if (birth <= 1956) pensionAge = 61;
    else if (birth <= 1960) pensionAge = 62;
    else if (birth <= 1964) pensionAge = 63;
    else if (birth <= 1968) pensionAge = 64;

    // 국민연금 월 납부액 (2024년 기준, 9% 중 본인 부담 4.5%)
    const monthlyContribution = Math.min(salary, 5900000) * 0.045;
    const totalContribution = monthlyContribution * 12 * years;

    // 예상 연금액 (간단화된 계산식)
    // 기본연금액 = 1.2 * (A + B) * (1 + 0.05 * n / 12)
    // A: 전 가입자 평균 소득월액 (약 280만원 가정)
    // B: 본인 평균 소득월액
    // n: 가입월수

    const avgSalary = 2800000; // 전 가입자 평균 (가정)
    const personalAvg = Math.min(salary, 5900000);
    const months = years * 12;

    // 20년 가입 기준 40% 소득대체율, 매년 0.5%씩 추가
    const baseRate = 0.4 + (years - 20) * 0.005;
    const adjustedRate = Math.max(0.2, Math.min(0.6, baseRate));

    const monthlyPension = Math.round((avgSalary + personalAvg) * 0.5 * adjustedRate * (months / 240));

    // 연금 수령 예상 (20년 수령 가정)
    const totalPension = monthlyPension * 12 * 20;
    const returnRate = ((totalPension / totalContribution - 1) * 100).toFixed(1);

    return {
      pensionAge,
      monthlyContribution: Math.round(monthlyContribution),
      totalContribution: Math.round(totalContribution),
      monthlyPension,
      totalPension,
      returnRate,
      yearsUntilPension: pensionAge - (new Date().getFullYear() - birth),
    };
  };

  const result = calculate();

  return (
    <div id="pension" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">국민연금 계산기</h2>
          <p className="text-xs text-gray-500">예상 연금 수령액 계산</p>
        </div>
        <span className="text-2xl">🏦</span>
      </div>

      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">출생년도</label>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="1985"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">예상 가입기간</label>
            <div className="relative">
              <input
                type="number"
                value={workYears}
                onChange={(e) => setWorkYears(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">년</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">월 평균 소득 (만원)</label>
          <input
            type="number"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="350"
          />
          <p className="text-xs text-gray-400 mt-1">세전 월급 기준 (상한액 590만원)</p>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
            <p className="text-white/80 text-sm mb-1">예상 월 연금액</p>
            <p className="text-3xl font-bold">
              {result.monthlyPension.toLocaleString()}
              <span className="text-lg ml-1 font-normal opacity-80">원</span>
            </p>
            <p className="text-white/70 text-sm mt-2">
              {result.pensionAge}세부터 수령 가능
              {result.yearsUntilPension > 0 && ` (${result.yearsUntilPension}년 후)`}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">월 납부 보험료 (본인부담)</span>
              <span className="font-medium">{result.monthlyContribution.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">총 납부 예상액</span>
              <span className="font-medium">{result.totalContribution.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">예상 총 수령액 (20년)</span>
              <span className="font-medium">{result.totalPension.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
              <span className="text-gray-600">예상 수익률</span>
              <span className="font-medium text-green-600">+{result.returnRate}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">참고사항</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 실제 연금액은 물가 상승률 등에 따라 달라집니다</p>
          <p>• 국민연금 최소 가입기간: 10년</p>
          <p>• 자세한 내용은 국민연금공단에서 확인하세요</p>
        </div>
      </div>
    </div>
  );
}
