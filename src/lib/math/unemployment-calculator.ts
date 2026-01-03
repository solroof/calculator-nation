import type { UnemploymentInput, UnemploymentResult } from '../types/unemployment';
import { UNEMPLOYMENT_2024, BENEFIT_DAYS } from '../types/unemployment';

/**
 * 실업급여 계산기
 */
export class UnemploymentCalculator {
  calculate(input: UnemploymentInput): UnemploymentResult {
    const { age, isDisabled, insuranceYears, avgMonthlyWage } = input;

    // 1일 평균임금 계산
    const avgDailyWage = Math.floor(avgMonthlyWage / 30);

    // 실업급여 일액 계산 (평균임금의 60%)
    const calculatedDaily = Math.floor(avgDailyWage * UNEMPLOYMENT_2024.rate);

    // 상/하한 적용
    let appliedDaily = calculatedDaily;
    let isMinApplied = false;
    let isMaxApplied = false;

    if (calculatedDaily < UNEMPLOYMENT_2024.minDaily) {
      appliedDaily = UNEMPLOYMENT_2024.minDaily;
      isMinApplied = true;
    } else if (calculatedDaily > UNEMPLOYMENT_2024.maxDaily) {
      appliedDaily = UNEMPLOYMENT_2024.maxDaily;
      isMaxApplied = true;
    }

    // 지급일수 결정
    const totalDays = this.getBenefitDays(age, isDisabled || false, insuranceYears);

    // 총액 및 기간 계산
    const totalBenefit = appliedDaily * totalDays;
    const monthlyBenefit = appliedDaily * 30;
    const durationMonths = Math.round(totalDays / 30 * 10) / 10;

    return {
      dailyBenefit: appliedDaily,
      monthlyBenefit,
      totalDays,
      totalBenefit,
      durationMonths,
      details: {
        calculatedDaily,
        appliedDaily,
        isMinApplied,
        isMaxApplied,
      },
    };
  }

  /**
   * 지급일수 결정
   */
  private getBenefitDays(age: number, isDisabled: boolean, years: number): number {
    const category = (age >= 50 || isDisabled) ? 'over50' : 'under50';
    const table = BENEFIT_DAYS[category];

    if (years < 1) return 0; // 1년 미만은 수급 불가
    if (years >= 10) return table['10'];
    if (years >= 5) return table['5'];
    if (years >= 3) return table['3'];
    return table['1'];
  }
}

export const unemploymentCalculator = new UnemploymentCalculator();
