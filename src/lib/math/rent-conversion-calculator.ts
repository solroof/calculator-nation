import type { RentConversionInput, RentConversionResult } from '../types/rent-conversion';
import { RENT_CONVERSION_2024 } from '../types/rent-conversion';

export class RentConversionCalculator {
  calculate(input: RentConversionInput): RentConversionResult {
    const {
      direction,
      jeonseDeposit = 0,
      convertAmount = 0,
      monthlyDeposit = 0,
      monthlyRent: inputMonthlyRent = 0,
      conversionRate: customRate,
      useCustomRate = false,
    } = input;

    // 전환율 결정
    const appliedRate = useCustomRate && customRate
      ? Math.min(customRate, RENT_CONVERSION_2024.maxConversionRate)
      : RENT_CONVERSION_2024.legalConversionRate;

    const rateDescription = useCustomRate
      ? `사용자 지정 ${(appliedRate * 100).toFixed(1)}%`
      : `법정 전환율 ${(appliedRate * 100).toFixed(1)}%`;

    let newDeposit: number;
    let monthlyRent: number;
    let convertedAmount: number;

    if (direction === 'jeonse-to-monthly') {
      // 전세 → 월세 전환
      // 전환할 금액 = 전세금 - 새 보증금
      convertedAmount = convertAmount || jeonseDeposit;
      newDeposit = jeonseDeposit - convertedAmount;

      // 월세 = 전환 금액 × 전환율 / 12
      monthlyRent = Math.round(convertedAmount * appliedRate / 12);
    } else {
      // 월세 → 전세 전환
      // 월세를 전세로 환산
      // 추가 보증금 = 월세 × 12 / 전환율
      const additionalDeposit = Math.round(inputMonthlyRent * 12 / appliedRate);
      convertedAmount = additionalDeposit;
      newDeposit = monthlyDeposit + additionalDeposit;
      monthlyRent = 0;
    }

    const yearlyRent = monthlyRent * 12;

    // 비용 비교 (2년 기준)
    const totalCost2Years = monthlyRent * 24;

    // 기회비용: 보증금을 은행에 예치했을 때 이자 (연 3.5% 기준, 2년)
    const depositInterestRate = RENT_CONVERSION_2024.baseRate;
    const opportunityCost = Math.round(newDeposit * depositInterestRate * 2);

    return {
      newDeposit,
      monthlyRent,
      yearlyRent,
      convertedAmount,
      appliedRate,
      rateDescription,
      comparison: {
        totalCost2Years,
        opportunityCost,
      },
    };
  }

  // 적정 월세 계산 (전세금 기준)
  calculateFairRent(jeonseDeposit: number, newDeposit: number): number {
    const convertAmount = jeonseDeposit - newDeposit;
    const monthlyRent = Math.round(
      convertAmount * RENT_CONVERSION_2024.legalConversionRate / 12
    );
    return monthlyRent;
  }

  // 적정 추가 보증금 계산 (월세 기준)
  calculateFairDeposit(monthlyRent: number): number {
    return Math.round(
      monthlyRent * 12 / RENT_CONVERSION_2024.legalConversionRate
    );
  }
}

export const rentConversionCalculator = new RentConversionCalculator();
