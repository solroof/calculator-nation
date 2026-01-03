// 전월세 전환 계산기 타입 정의

// 전환 방향
export type ConversionDirection = 'jeonse-to-monthly' | 'monthly-to-jeonse';

// 2024년 전월세 전환율 기준
export const RENT_CONVERSION_2024 = {
  // 한국은행 기준금리 (2024년 기준)
  baseRate: 0.035, // 3.5%
  // 법정 가산 이율
  additionalRate: 0.02, // 2%
  // 법정 전환율 = 기준금리 + 2%
  legalConversionRate: 0.055, // 5.5%
  // 최대 전환율
  maxConversionRate: 0.10, // 10%
} as const;

export interface RentConversionInput {
  direction: ConversionDirection;
  // 전세 → 월세 전환 시
  jeonseDeposit?: number; // 전세 보증금
  convertAmount?: number; // 전환할 금액
  // 월세 → 전세 전환 시
  monthlyDeposit?: number; // 월세 보증금
  monthlyRent?: number; // 현재 월세
  // 공통
  conversionRate?: number; // 전환율 (연이율, 0.055 = 5.5%)
  useCustomRate?: boolean; // 사용자 지정 전환율 사용 여부
}

export interface RentConversionResult {
  // 전세 → 월세
  newDeposit: number; // 새 보증금
  monthlyRent: number; // 환산 월세
  yearlyRent: number; // 연간 월세 총액
  // 전환 정보
  convertedAmount: number; // 전환된 금액
  appliedRate: number; // 적용된 전환율
  rateDescription: string; // 전환율 설명
  // 비교
  comparison: {
    totalCost2Years: number; // 2년간 총 비용 (보증금 제외)
    opportunityCost: number; // 기회비용 (보증금 이자)
  };
}
