// 양도소득세 계산기 타입 정의

// 부동산 유형
export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial';

// 주택 수
export type HouseCount = 1 | 2 | 3; // 1주택, 2주택, 3주택 이상

// 2024년 양도소득세 기본세율
export const CAPITAL_GAINS_TAX_2024 = {
  // 기본 세율 (과세표준별)
  taxBrackets: [
    { min: 0, max: 14000000, rate: 0.06, deduction: 0 }, // 1,400만원 이하: 6%
    { min: 14000000, max: 50000000, rate: 0.15, deduction: 1260000 }, // 5,000만원 이하: 15%
    { min: 50000000, max: 88000000, rate: 0.24, deduction: 5760000 }, // 8,800만원 이하: 24%
    { min: 88000000, max: 150000000, rate: 0.35, deduction: 15440000 }, // 1.5억 이하: 35%
    { min: 150000000, max: 300000000, rate: 0.38, deduction: 19940000 }, // 3억 이하: 38%
    { min: 300000000, max: 500000000, rate: 0.40, deduction: 25940000 }, // 5억 이하: 40%
    { min: 500000000, max: 1000000000, rate: 0.42, deduction: 35940000 }, // 10억 이하: 42%
    { min: 1000000000, max: Infinity, rate: 0.45, deduction: 65940000 }, // 10억 초과: 45%
  ],
  // 단기 양도 (1년 미만)
  shortTerm: {
    house: 0.70, // 주택: 70%
    other: 0.50, // 기타: 50%
  },
  // 1~2년 보유
  midTerm: 0.40, // 40%
  // 다주택자 중과세율 (조정대상지역)
  multiHouseSurcharge: {
    twoHouse: 0.20, // 2주택: 기본세율 + 20%p
    threeOrMore: 0.30, // 3주택 이상: 기본세율 + 30%p
  },
  // 장기보유특별공제 (2년 이상)
  longTermDeduction: {
    // 일반: 연 2%, 최대 30% (15년)
    general: { rate: 0.02, maxYears: 15, maxRate: 0.30 },
    // 1세대 1주택 (2년 거주): 연 4%+4%, 최대 80%
    oneHouseResident: { holdingRate: 0.04, residenceRate: 0.04, maxRate: 0.80 },
  },
  // 1세대 1주택 비과세 기준
  oneHouseExemption: 1200000000, // 12억 이하 비과세 (2024년)
  // 기본공제
  basicDeduction: 2500000, // 250만원
  // 지방소득세
  localIncomeTax: 0.1, // 양도세의 10%
} as const;

export interface CapitalGainsTaxInput {
  propertyType: PropertyType;
  acquisitionPrice: number; // 취득가액
  sellingPrice: number; // 양도가액
  acquisitionDate: string; // 취득일
  sellingDate: string; // 양도일
  expenses?: number; // 필요경비 (취득세, 중개수수료 등)
  houseCount?: HouseCount; // 주택 수
  isRegulatedArea?: boolean; // 조정대상지역 여부
  residenceYears?: number; // 거주 기간 (년)
  isOneHouseExemption?: boolean; // 1세대 1주택 비과세 적용 여부
}

export interface CapitalGainsTaxResult {
  capitalGain: number; // 양도차익
  taxableGain: number; // 과세대상 양도차익
  longTermDeduction: number; // 장기보유특별공제
  taxableIncome: number; // 양도소득금액 (과세표준)
  basicDeduction: number; // 기본공제
  taxBase: number; // 과세표준
  calculatedTax: number; // 산출세액
  additionalTax: number; // 가산세 (다주택 등)
  capitalGainsTax: number; // 양도소득세
  localIncomeTax: number; // 지방소득세
  totalTax: number; // 총 세금
  effectiveRate: number; // 실효세율
  holdingPeriod: {
    years: number;
    months: number;
    totalMonths: number;
  };
  appliedRate: {
    rate: number;
    description: string;
  };
  breakdown: {
    label: string;
    amount: number;
  }[];
}
