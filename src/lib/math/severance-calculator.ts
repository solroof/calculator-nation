import type { SeveranceInput, SeveranceResult } from '../types/severance';

/**
 * 퇴직금 계산기
 * 퇴직금 = 1일 평균임금 × 30일 × (총 근속일수 / 365)
 */
export class SeveranceCalculator {
  /**
   * 메인 계산 함수
   */
  calculate(input: SeveranceInput): SeveranceResult {
    const { startDate, endDate, recentSalaries, annualBonus = 0, annualAllowance = 0 } = input;

    // 근속 기간 계산
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;

    // 최근 3개월 급여 합계
    const recentSalaryTotal = recentSalaries.reduce((sum, s) => sum + s, 0);

    // 3개월 기준 상여금/수당 비례액
    const bonusRatio = Math.floor((annualBonus / 12) * 3);
    const allowanceRatio = Math.floor((annualAllowance / 12) * 3);

    // 3개월 총 임금
    const totalWage = recentSalaryTotal + bonusRatio + allowanceRatio;

    // 3개월 총 일수 (퇴직일 이전 3개월의 총 일수, 보통 89~92일)
    const avgDays = this.getThreeMonthDays(endDate);

    // 1일 평균임금
    const avgDailySalary = Math.floor(totalWage / avgDays);

    // 월 평균임금
    const avgMonthlySalary = Math.floor(totalWage / 3);

    // 퇴직금 계산
    // 퇴직금 = 평균임금 × 30일 × (재직일수 / 365)
    const severancePay = Math.floor(avgDailySalary * 30 * (totalDays / 365));

    return {
      totalDays,
      years,
      months,
      days,
      avgDailySalary,
      avgMonthlySalary,
      severancePay,
      severanceFormula: `${avgDailySalary.toLocaleString()}원 × 30일 × (${totalDays}일 / 365)`,
      details: {
        recentSalaryTotal,
        bonusRatio,
        allowanceRatio,
        totalWage,
        avgDays,
      },
    };
  }

  /**
   * 퇴직일 이전 3개월의 총 일수 계산
   */
  private getThreeMonthDays(endDateStr: string): number {
    const endDate = new Date(endDateStr);
    const threeMonthsAgo = new Date(endDate);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const diffTime = endDate.getTime() - threeMonthsAgo.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }
}

export const severanceCalculator = new SeveranceCalculator();
