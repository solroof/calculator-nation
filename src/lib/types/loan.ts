// 대출 이자 계산기 타입 정의

// 상환 방식
export type RepaymentType =
  | 'equal-principal' // 원금균등분할상환
  | 'equal-payment'   // 원리금균등상환
  | 'bullet';         // 만기일시상환

export interface LoanInput {
  principal: number;        // 대출 원금
  annualRate: number;       // 연이율 (0.05 = 5%)
  termMonths: number;       // 대출 기간 (개월)
  repaymentType: RepaymentType;
  gracePeriodMonths?: number; // 거치 기간 (개월)
}

export interface MonthlyPayment {
  month: number;
  principal: number;       // 원금 상환액
  interest: number;        // 이자
  payment: number;         // 월 납입금 (원금 + 이자)
  remainingBalance: number; // 잔여 원금
}

export interface LoanResult {
  monthlyPayments: MonthlyPayment[];
  summary: {
    totalPayment: number;     // 총 납입금
    totalInterest: number;    // 총 이자
    totalPrincipal: number;   // 총 원금
    avgMonthlyPayment: number; // 평균 월 납입금
    firstMonthPayment: number; // 첫 달 납입금
    lastMonthPayment: number;  // 마지막 달 납입금
  };
  repaymentType: RepaymentType;
  repaymentDescription: string;
}
