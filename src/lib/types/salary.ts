// 연봉 실수령액 계산기 타입 정의

// 2024년 기준 4대보험 요율
export const INSURANCE_RATES_2024 = {
  nationalPension: 0.045,      // 국민연금 4.5%
  healthInsurance: 0.03545,    // 건강보험 3.545%
  longTermCare: 0.1295,        // 장기요양보험 (건강보험료의 12.95%)
  employmentInsurance: 0.009,  // 고용보험 0.9%
} as const;

// 국민연금 상/하한액 (2024년)
export const PENSION_LIMITS_2024 = {
  min: 370000,   // 하한액 37만원
  max: 5900000,  // 상한액 590만원
} as const;

// 비과세 항목
export interface TaxExemptItems {
  meals: number;           // 식대 (월 20만원 한도)
  carAllowance: number;    // 자가운전보조금 (월 20만원 한도)
  childcare: number;       // 보육수당 (월 10만원 한도)
  other: number;           // 기타 비과세
}

// 입력 데이터
export interface SalaryInput {
  annualSalary: number;           // 연봉 (세전)
  dependents: number;             // 부양가족 수 (본인 포함)
  childrenUnder20: number;        // 20세 이하 자녀 수
  taxExempt?: Partial<TaxExemptItems>;  // 비과세 항목
  includeBonus?: boolean;         // 상여금 포함 여부
  bonusMonths?: number;           // 상여금 개월수
}

// 월별 공제 내역
export interface MonthlyDeductions {
  nationalPension: number;        // 국민연금
  healthInsurance: number;        // 건강보험
  longTermCare: number;           // 장기요양보험
  employmentInsurance: number;    // 고용보험
  incomeTax: number;              // 소득세
  localIncomeTax: number;         // 지방소득세
  totalDeduction: number;         // 총 공제액
}

// 계산 결과
export interface SalaryResult {
  // 기본 정보
  annualSalary: number;           // 연봉
  monthlySalary: number;          // 월급 (세전)
  taxableIncome: number;          // 과세 대상 소득 (월)

  // 공제 내역
  deductions: MonthlyDeductions;

  // 실수령액
  monthlyNetSalary: number;       // 월 실수령액
  annualNetSalary: number;        // 연 실수령액

  // 연간 총액
  annualDeductions: {
    nationalPension: number;
    healthInsurance: number;
    longTermCare: number;
    employmentInsurance: number;
    incomeTax: number;
    localIncomeTax: number;
    total: number;
  };

  // 비율
  deductionRate: number;          // 공제율 (%)
  netRate: number;                // 실수령 비율 (%)
}

// 간이세액표 구간 (월 급여 기준)
export interface TaxBracket {
  min: number;
  max: number;
  // 부양가족 수별 세액 (1~11명)
  taxByDependents: number[];
}
