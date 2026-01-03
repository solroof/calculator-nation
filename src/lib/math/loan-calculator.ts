import type { LoanInput, LoanResult, MonthlyPayment, RepaymentType } from '../types/loan';

export class LoanCalculator {
  calculate(input: LoanInput): LoanResult {
    const { principal, annualRate, termMonths, repaymentType, gracePeriodMonths = 0 } = input;
    const monthlyRate = annualRate / 12;

    let monthlyPayments: MonthlyPayment[];
    let repaymentDescription: string;

    switch (repaymentType) {
      case 'equal-principal':
        monthlyPayments = this.calculateEqualPrincipal(
          principal, monthlyRate, termMonths, gracePeriodMonths
        );
        repaymentDescription = '원금균등분할상환';
        break;
      case 'equal-payment':
        monthlyPayments = this.calculateEqualPayment(
          principal, monthlyRate, termMonths, gracePeriodMonths
        );
        repaymentDescription = '원리금균등상환';
        break;
      case 'bullet':
        monthlyPayments = this.calculateBullet(
          principal, monthlyRate, termMonths
        );
        repaymentDescription = '만기일시상환';
        break;
      default:
        throw new Error(`Unknown repayment type: ${repaymentType}`);
    }

    const totalPayment = monthlyPayments.reduce((sum, m) => sum + m.payment, 0);
    const totalInterest = monthlyPayments.reduce((sum, m) => sum + m.interest, 0);
    const totalPrincipal = monthlyPayments.reduce((sum, m) => sum + m.principal, 0);
    const avgMonthlyPayment = Math.round(totalPayment / termMonths);

    return {
      monthlyPayments,
      summary: {
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        totalPrincipal: Math.round(totalPrincipal),
        avgMonthlyPayment,
        firstMonthPayment: Math.round(monthlyPayments[0].payment),
        lastMonthPayment: Math.round(monthlyPayments[monthlyPayments.length - 1].payment),
      },
      repaymentType,
      repaymentDescription,
    };
  }

  // 원금균등분할상환
  private calculateEqualPrincipal(
    principal: number,
    monthlyRate: number,
    termMonths: number,
    gracePeriodMonths: number
  ): MonthlyPayment[] {
    const payments: MonthlyPayment[] = [];
    const repaymentMonths = termMonths - gracePeriodMonths;
    const monthlyPrincipal = principal / repaymentMonths;
    let remainingBalance = principal;

    for (let month = 1; month <= termMonths; month++) {
      const interest = remainingBalance * monthlyRate;

      if (month <= gracePeriodMonths) {
        // 거치 기간: 이자만 납부
        payments.push({
          month,
          principal: 0,
          interest: Math.round(interest),
          payment: Math.round(interest),
          remainingBalance: Math.round(remainingBalance),
        });
      } else {
        // 상환 기간: 원금 + 이자
        const principalPayment = monthlyPrincipal;
        remainingBalance -= principalPayment;

        payments.push({
          month,
          principal: Math.round(principalPayment),
          interest: Math.round(interest),
          payment: Math.round(principalPayment + interest),
          remainingBalance: Math.max(0, Math.round(remainingBalance)),
        });
      }
    }

    return payments;
  }

  // 원리금균등상환
  private calculateEqualPayment(
    principal: number,
    monthlyRate: number,
    termMonths: number,
    gracePeriodMonths: number
  ): MonthlyPayment[] {
    const payments: MonthlyPayment[] = [];
    const repaymentMonths = termMonths - gracePeriodMonths;
    let remainingBalance = principal;

    // 월 납입금 계산 (PMT 공식)
    const monthlyPayment = monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
        (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
      : principal / repaymentMonths;

    for (let month = 1; month <= termMonths; month++) {
      const interest = remainingBalance * monthlyRate;

      if (month <= gracePeriodMonths) {
        // 거치 기간: 이자만 납부
        payments.push({
          month,
          principal: 0,
          interest: Math.round(interest),
          payment: Math.round(interest),
          remainingBalance: Math.round(remainingBalance),
        });
      } else {
        // 상환 기간
        const principalPayment = monthlyPayment - interest;
        remainingBalance -= principalPayment;

        payments.push({
          month,
          principal: Math.round(principalPayment),
          interest: Math.round(interest),
          payment: Math.round(monthlyPayment),
          remainingBalance: Math.max(0, Math.round(remainingBalance)),
        });
      }
    }

    return payments;
  }

  // 만기일시상환
  private calculateBullet(
    principal: number,
    monthlyRate: number,
    termMonths: number
  ): MonthlyPayment[] {
    const payments: MonthlyPayment[] = [];
    const monthlyInterest = principal * monthlyRate;

    for (let month = 1; month <= termMonths; month++) {
      const isLastMonth = month === termMonths;

      payments.push({
        month,
        principal: isLastMonth ? Math.round(principal) : 0,
        interest: Math.round(monthlyInterest),
        payment: isLastMonth
          ? Math.round(principal + monthlyInterest)
          : Math.round(monthlyInterest),
        remainingBalance: isLastMonth ? 0 : Math.round(principal),
      });
    }

    return payments;
  }

  // 상환 방식별 설명
  getRepaymentDescription(type: RepaymentType): string {
    switch (type) {
      case 'equal-principal':
        return '매달 동일한 원금을 상환하며, 이자는 잔액에 따라 감소합니다.';
      case 'equal-payment':
        return '매달 동일한 금액(원금+이자)을 상환합니다.';
      case 'bullet':
        return '만기까지 이자만 납부하고, 만기에 원금을 일시 상환합니다.';
      default:
        return '';
    }
  }
}

export const loanCalculator = new LoanCalculator();
