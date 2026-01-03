// 실업급여 계산기 타입 정의

// 2024년 실업급여 기준
export const UNEMPLOYMENT_2024 = {
  minDaily: 63104,        // 최저 일액 (최저임금 80%)
  maxDaily: 66000,        // 상한액
  rate: 0.6,              // 퇴직 전 평균임금의 60%
} as const;

// 고용보험 가입기간별 지급일수
export const BENEFIT_DAYS: Record<string, Record<string, number>> = {
  // 나이 < 50세
  under50: {
    '1': 120,    // 1년 이상 ~ 3년 미만
    '3': 150,    // 3년 이상 ~ 5년 미만
    '5': 180,    // 5년 이상 ~ 10년 미만
    '10': 210,   // 10년 이상
  },
  // 나이 >= 50세 또는 장애인
  over50: {
    '1': 150,
    '3': 180,
    '5': 210,
    '10': 240,
  },
};

export interface UnemploymentInput {
  age: number;                    // 나이
  isDisabled?: boolean;           // 장애인 여부
  insuranceYears: number;         // 고용보험 가입기간 (년)
  avgMonthlyWage: number;         // 퇴직 전 3개월 평균 월급
}

export interface UnemploymentResult {
  dailyBenefit: number;           // 일 실업급여
  monthlyBenefit: number;         // 월 예상 수령액 (30일 기준)
  totalDays: number;              // 총 지급일수
  totalBenefit: number;           // 총 수령액
  durationMonths: number;         // 수급기간 (월)

  details: {
    calculatedDaily: number;      // 계산된 일액 (평균임금 × 60%)
    appliedDaily: number;         // 적용 일액 (상/하한 적용 후)
    isMinApplied: boolean;        // 하한 적용 여부
    isMaxApplied: boolean;        // 상한 적용 여부
  };
}
