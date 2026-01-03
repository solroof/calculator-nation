// 적금 이자 계산기 타입 정의

// 적금 유형
export type SavingsType = 'regular' | 'lump-sum'; // 정기적금, 정기예금

// 이자 계산 방식
export type InterestType = 'simple' | 'compound'; // 단리, 복리

// 세금 유형
export type TaxType = 'normal' | 'preferential' | 'tax-free'; // 일반과세, 세금우대, 비과세

// 2024년 이자소득세율
export const SAVINGS_TAX_2024 = {
  normal: 0.154,       // 일반과세: 15.4% (소득세 14% + 지방소득세 1.4%)
  preferential: 0.095, // 세금우대: 9.5%
  'tax-free': 0,       // 비과세: 0%
} as const;

export interface SavingsInput {
  savingsType: SavingsType;
  monthlyDeposit?: number;  // 월 납입금 (정기적금)
  lumpSumDeposit?: number;  // 예치금 (정기예금)
  annualRate: number;       // 연이율 (0.05 = 5%)
  termMonths: number;       // 적금 기간 (개월)
  interestType: InterestType;
  taxType: TaxType;
}

export interface SavingsResult {
  totalDeposit: number;     // 총 납입금
  totalInterest: number;    // 세전 이자
  tax: number;              // 세금
  netInterest: number;      // 세후 이자
  maturityAmount: number;   // 만기 수령액
  effectiveRate: number;    // 실질 수익률
  monthlyBreakdown?: {
    month: number;
    deposit: number;
    balance: number;
    interest: number;
  }[];
  summary: {
    savingsType: string;
    interestType: string;
    taxType: string;
    taxRate: number;
  };
}
