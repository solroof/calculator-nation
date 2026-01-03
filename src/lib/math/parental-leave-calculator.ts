import type { ParentalLeaveInput, ParentalLeaveResult } from '../types/parental-leave';
import { PARENTAL_LEAVE_2024 } from '../types/parental-leave';

export class ParentalLeaveCalculator {
  calculate(input: ParentalLeaveInput): ParentalLeaveResult {
    const { monthlyWage, leaveDurationMonths, isSixPlusSix } = input;
    const monthlyBenefits: ParentalLeaveResult['monthlyBenefits'] = [];

    let first3MonthsTotal = 0;
    let after3MonthsTotal = 0;

    for (let month = 1; month <= leaveDurationMonths; month++) {
      let amount: number;
      let rate: number;
      let description: string;

      if (isSixPlusSix && month <= 6) {
        // 6+6 부모 동시 육휴: 첫 6개월 100%
        const { max } = PARENTAL_LEAVE_2024.sixPlusSix;
        rate = 1.0;
        amount = Math.min(monthlyWage, max);
        description = '6+6 육휴 (100%)';
        first3MonthsTotal += amount;
      } else if (month <= 3) {
        // 첫 3개월: 80%
        const { rate: r, max, min } = PARENTAL_LEAVE_2024.first3Months;
        rate = r;
        const calculated = Math.floor(monthlyWage * rate);
        amount = Math.max(min, Math.min(calculated, max));
        description = '첫 3개월 (80%)';
        first3MonthsTotal += amount;
      } else {
        // 4개월 이후: 50%
        const { rate: r, max, min } = PARENTAL_LEAVE_2024.after3Months;
        rate = r;
        const calculated = Math.floor(monthlyWage * rate);
        amount = Math.max(min, Math.min(calculated, max));
        description = '4개월 이후 (50%)';
        after3MonthsTotal += amount;
      }

      monthlyBenefits.push({ month, amount, rate, description });
    }

    const totalBenefit = first3MonthsTotal + after3MonthsTotal;
    const avgMonthlyBenefit = leaveDurationMonths > 0
      ? Math.floor(totalBenefit / leaveDurationMonths)
      : 0;

    return {
      monthlyBenefits,
      totalBenefit,
      avgMonthlyBenefit,
      first3MonthsTotal,
      after3MonthsTotal,
    };
  }
}

export const parentalLeaveCalculator = new ParentalLeaveCalculator();
