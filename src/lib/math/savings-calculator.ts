import type { SavingsInput, SavingsResult, InterestType, TaxType } from '../types/savings';
import { SAVINGS_TAX_2024 } from '../types/savings';

export class SavingsCalculator {
  calculate(input: SavingsInput): SavingsResult {
    const {
      savingsType,
      monthlyDeposit = 0,
      lumpSumDeposit = 0,
      annualRate,
      termMonths,
      interestType,
      taxType,
    } = input;

    const monthlyRate = annualRate / 12;
    const taxRate = SAVINGS_TAX_2024[taxType];

    let totalDeposit: number;
    let totalInterest: number;
    let monthlyBreakdown: SavingsResult['monthlyBreakdown'];

    if (savingsType === 'regular') {
      // 정기적금: 매달 납입
      const result = this.calculateRegularSavings(
        monthlyDeposit,
        monthlyRate,
        termMonths,
        interestType
      );
      totalDeposit = result.totalDeposit;
      totalInterest = result.totalInterest;
      monthlyBreakdown = result.breakdown;
    } else {
      // 정기예금: 목돈 예치
      const result = this.calculateLumpSumSavings(
        lumpSumDeposit,
        annualRate,
        termMonths,
        interestType
      );
      totalDeposit = result.totalDeposit;
      totalInterest = result.totalInterest;
    }

    const tax = Math.floor(totalInterest * taxRate);
    const netInterest = totalInterest - tax;
    const maturityAmount = totalDeposit + netInterest;
    const effectiveRate = totalDeposit > 0
      ? (netInterest / totalDeposit) * (12 / termMonths)
      : 0;

    return {
      totalDeposit: Math.round(totalDeposit),
      totalInterest: Math.round(totalInterest),
      tax: Math.round(tax),
      netInterest: Math.round(netInterest),
      maturityAmount: Math.round(maturityAmount),
      effectiveRate,
      monthlyBreakdown,
      summary: {
        savingsType: savingsType === 'regular' ? '정기적금' : '정기예금',
        interestType: interestType === 'simple' ? '단리' : '복리',
        taxType: this.getTaxTypeLabel(taxType),
        taxRate,
      },
    };
  }

  // 정기적금 (매달 납입)
  private calculateRegularSavings(
    monthlyDeposit: number,
    monthlyRate: number,
    termMonths: number,
    interestType: InterestType
  ): { totalDeposit: number; totalInterest: number; breakdown: SavingsResult['monthlyBreakdown'] } {
    const breakdown: SavingsResult['monthlyBreakdown'] = [];
    let totalDeposit = 0;
    let totalInterest = 0;
    let balance = 0;

    for (let month = 1; month <= termMonths; month++) {
      balance += monthlyDeposit;
      totalDeposit += monthlyDeposit;

      if (interestType === 'compound') {
        // 복리: 매달 이자가 원금에 합산
        const monthInterest = balance * monthlyRate;
        balance += monthInterest;
        totalInterest += monthInterest;
      } else {
        // 단리: 납입 원금에 대해 남은 기간만큼 이자 계산
        const remainingMonths = termMonths - month + 1;
        const monthInterest = monthlyDeposit * monthlyRate * (remainingMonths - 0.5);
        totalInterest += monthInterest;
      }

      breakdown.push({
        month,
        deposit: monthlyDeposit,
        balance: Math.round(balance),
        interest: Math.round(totalInterest),
      });
    }

    // 단리의 경우 balance는 원금만
    if (interestType === 'simple') {
      balance = totalDeposit;
    }

    return { totalDeposit, totalInterest, breakdown };
  }

  // 정기예금 (목돈 예치)
  private calculateLumpSumSavings(
    principal: number,
    annualRate: number,
    termMonths: number,
    interestType: InterestType
  ): { totalDeposit: number; totalInterest: number } {
    const totalDeposit = principal;
    let totalInterest: number;

    if (interestType === 'compound') {
      // 복리: 월복리 계산
      const monthlyRate = annualRate / 12;
      const futureValue = principal * Math.pow(1 + monthlyRate, termMonths);
      totalInterest = futureValue - principal;
    } else {
      // 단리: 단순 이자 계산
      totalInterest = principal * annualRate * (termMonths / 12);
    }

    return { totalDeposit, totalInterest };
  }

  private getTaxTypeLabel(taxType: TaxType): string {
    switch (taxType) {
      case 'normal':
        return '일반과세 (15.4%)';
      case 'preferential':
        return '세금우대 (9.5%)';
      case 'tax-free':
        return '비과세';
      default:
        return '';
    }
  }
}

export const savingsCalculator = new SavingsCalculator();
