// 퇴직금 계산기 타입 정의

export interface SeveranceInput {
  startDate: string;          // 입사일 (YYYY-MM-DD)
  endDate: string;            // 퇴사일 (YYYY-MM-DD)
  recentSalaries: number[];   // 최근 3개월 급여 (세전)
  annualBonus?: number;       // 연간 상여금 (선택)
  annualAllowance?: number;   // 연간 수당 (선택)
}

export interface SeveranceResult {
  // 근속 기간
  totalDays: number;          // 총 근무일수
  years: number;              // 년
  months: number;             // 월
  days: number;               // 일

  // 평균임금 계산
  avgDailySalary: number;     // 1일 평균임금
  avgMonthlySalary: number;   // 월 평균임금

  // 퇴직금
  severancePay: number;       // 퇴직금
  severanceFormula: string;   // 계산식

  // 상세
  details: {
    recentSalaryTotal: number;    // 최근 3개월 급여 합계
    bonusRatio: number;           // 상여금 비례액
    allowanceRatio: number;       // 수당 비례액
    totalWage: number;            // 3개월 총 임금
    avgDays: number;              // 3개월 총 일수 (보통 89~92일)
  };
}
