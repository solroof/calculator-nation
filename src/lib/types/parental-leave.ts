// 육아휴직 급여 계산기 타입 정의

// 2024년 육아휴직 급여 기준
export const PARENTAL_LEAVE_2024 = {
  // 첫 3개월: 통상임금 80% (상한 150만원, 하한 70만원)
  first3Months: { rate: 0.8, max: 1500000, min: 700000 },
  // 4~12개월: 통상임금 50% (상한 120만원, 하한 70만원)
  after3Months: { rate: 0.5, max: 1200000, min: 700000 },
  // 6+6 부모 동시 육휴 시 첫 6개월 (2024년 시행)
  sixPlusSix: { rate: 1.0, max: 4500000 }, // 최대 450만원
} as const;

export interface ParentalLeaveInput {
  monthlyWage: number;         // 통상임금 (월)
  leaveDurationMonths: number; // 휴직 기간 (개월)
  isSixPlusSix?: boolean;      // 6+6 부모 동시 육휴 해당 여부
  isSecondChild?: boolean;     // 둘째 이상 자녀 여부
}

export interface ParentalLeaveResult {
  // 월별 급여
  monthlyBenefits: {
    month: number;
    amount: number;
    rate: number;
    description: string;
  }[];

  // 총액
  totalBenefit: number;
  avgMonthlyBenefit: number;

  // 요약
  first3MonthsTotal: number;
  after3MonthsTotal: number;
}
