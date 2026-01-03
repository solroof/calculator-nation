import type {
  SalaryInput,
  SalaryResult,
  MonthlyDeductions,
} from '../types/salary';
import {
  INSURANCE_RATES_2024,
  PENSION_LIMITS_2024,
} from '../types/salary';

/**
 * 근로소득 간이세액표 (2024년 기준, 월급여 기준)
 * 실제 간이세액표를 간략화한 버전
 */
const SIMPLIFIED_TAX_TABLE: { min: number; max: number; rate: number; deduction: number }[] = [
  { min: 0, max: 1060000, rate: 0, deduction: 0 },
  { min: 1060000, max: 1500000, rate: 0.06, deduction: 63600 },
  { min: 1500000, max: 3000000, rate: 0.06, deduction: 63600 },
  { min: 3000000, max: 4500000, rate: 0.15, deduction: 333600 },
  { min: 4500000, max: 8700000, rate: 0.24, deduction: 738600 },
  { min: 8700000, max: 15000000, rate: 0.35, deduction: 1695600 },
  { min: 15000000, max: 30000000, rate: 0.38, deduction: 2145600 },
  { min: 30000000, max: 50000000, rate: 0.40, deduction: 2745600 },
  { min: 50000000, max: 100000000, rate: 0.42, deduction: 3745600 },
  { min: 100000000, max: Infinity, rate: 0.45, deduction: 6745600 },
];

/**
 * 부양가족 공제 (월 기준)
 */
const DEPENDENT_DEDUCTION_MONTHLY = 125000; // 1인당 월 12.5만원 (연 150만원)
const CHILD_DEDUCTION_MONTHLY = 12500; // 20세 이하 자녀 추가공제

/**
 * 연봉 실수령액 계산기
 */
export class SalaryCalculator {
  /**
   * 메인 계산 함수
   */
  calculate(input: SalaryInput): SalaryResult {
    const { annualSalary, dependents, childrenUnder20, taxExempt } = input;

    // 월급 계산 (12개월 균등 분할)
    const monthlySalary = Math.floor(annualSalary / 12);

    // 비과세 소득 계산
    const monthlyTaxExempt = this.calculateTaxExempt(taxExempt);

    // 과세 대상 소득
    const taxableIncome = Math.max(0, monthlySalary - monthlyTaxExempt);

    // 4대보험 계산
    const nationalPension = this.calculateNationalPension(taxableIncome);
    const healthInsurance = this.calculateHealthInsurance(taxableIncome);
    const longTermCare = this.calculateLongTermCare(healthInsurance);
    const employmentInsurance = this.calculateEmploymentInsurance(taxableIncome);

    // 소득세 계산 (4대보험 공제 후)
    const taxableAfterInsurance = taxableIncome - nationalPension - healthInsurance - longTermCare - employmentInsurance;
    const incomeTax = this.calculateIncomeTax(taxableAfterInsurance, dependents, childrenUnder20);
    const localIncomeTax = Math.floor(incomeTax * 0.1); // 지방소득세 = 소득세의 10%

    // 총 공제액
    const totalDeduction = nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;

    // 월 실수령액
    const monthlyNetSalary = monthlySalary - totalDeduction;

    // 공제 내역
    const deductions: MonthlyDeductions = {
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      localIncomeTax,
      totalDeduction,
    };

    // 연간 총액
    const annualDeductions = {
      nationalPension: nationalPension * 12,
      healthInsurance: healthInsurance * 12,
      longTermCare: longTermCare * 12,
      employmentInsurance: employmentInsurance * 12,
      incomeTax: incomeTax * 12,
      localIncomeTax: localIncomeTax * 12,
      total: totalDeduction * 12,
    };

    return {
      annualSalary,
      monthlySalary,
      taxableIncome,
      deductions,
      monthlyNetSalary,
      annualNetSalary: monthlyNetSalary * 12,
      annualDeductions,
      deductionRate: Math.round((totalDeduction / monthlySalary) * 1000) / 10,
      netRate: Math.round((monthlyNetSalary / monthlySalary) * 1000) / 10,
    };
  }

  /**
   * 비과세 소득 계산
   */
  private calculateTaxExempt(taxExempt?: Partial<{ meals: number; carAllowance: number; childcare: number; other: number }>): number {
    if (!taxExempt) return 0;

    const meals = Math.min(taxExempt.meals || 0, 200000); // 식대 한도 20만원
    const carAllowance = Math.min(taxExempt.carAllowance || 0, 200000); // 자가운전보조금 한도 20만원
    const childcare = Math.min(taxExempt.childcare || 0, 100000); // 보육수당 한도 10만원
    const other = taxExempt.other || 0;

    return meals + carAllowance + childcare + other;
  }

  /**
   * 국민연금 계산 (상/하한액 적용)
   */
  private calculateNationalPension(monthlyIncome: number): number {
    const { min, max } = PENSION_LIMITS_2024;
    const baseAmount = Math.min(Math.max(monthlyIncome, min), max);
    return Math.floor(baseAmount * INSURANCE_RATES_2024.nationalPension);
  }

  /**
   * 건강보험 계산
   */
  private calculateHealthInsurance(monthlyIncome: number): number {
    return Math.floor(monthlyIncome * INSURANCE_RATES_2024.healthInsurance);
  }

  /**
   * 장기요양보험 계산 (건강보험료의 12.95%)
   */
  private calculateLongTermCare(healthInsurance: number): number {
    return Math.floor(healthInsurance * INSURANCE_RATES_2024.longTermCare);
  }

  /**
   * 고용보험 계산
   */
  private calculateEmploymentInsurance(monthlyIncome: number): number {
    return Math.floor(monthlyIncome * INSURANCE_RATES_2024.employmentInsurance);
  }

  /**
   * 소득세 계산 (간이세액표 기반)
   */
  private calculateIncomeTax(taxableIncome: number, dependents: number, childrenUnder20: number): number {
    if (taxableIncome <= 0) return 0;

    // 기본 세액 계산
    let baseTax = 0;
    for (const bracket of SIMPLIFIED_TAX_TABLE) {
      if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
        baseTax = Math.floor(taxableIncome * bracket.rate - bracket.deduction);
        break;
      }
      if (taxableIncome > bracket.max && bracket.max === Infinity) {
        baseTax = Math.floor(taxableIncome * bracket.rate - bracket.deduction);
        break;
      }
    }

    // 부양가족 공제
    const dependentDeduction = (dependents - 1) * DEPENDENT_DEDUCTION_MONTHLY; // 본인 제외
    const childDeduction = childrenUnder20 * CHILD_DEDUCTION_MONTHLY;

    // 최종 세액 (음수 방지)
    return Math.max(0, Math.floor(baseTax - dependentDeduction - childDeduction));
  }
}

// 싱글톤 인스턴스
export const salaryCalculator = new SalaryCalculator();
