// 부동산 취득세 계산기 타입 정의

// 부동산 유형
export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial' | 'officetel';

// 주택 수
export type HouseCount = 1 | 2 | 3; // 1주택, 2주택, 3주택 이상

// 2024년 취득세율 기준
export const ACQUISITION_TAX_2024 = {
  // 주택 (1주택자 기준)
  house: {
    // 6억 이하: 1%
    under600M: { rate: 0.01, threshold: 600000000 },
    // 6억~9억: 누진세율 (1~3%)
    between600M900M: {
      minRate: 0.01,
      maxRate: 0.03,
      minThreshold: 600000000,
      maxThreshold: 900000000,
    },
    // 9억 초과: 3%
    over900M: { rate: 0.03, threshold: 900000000 },
  },
  // 다주택자 중과세율 (조정대상지역)
  multiHouse: {
    twoHouse: 0.08, // 2주택: 8%
    threeOrMore: 0.12, // 3주택 이상: 12%
  },
  // 비조정대상지역 다주택자
  nonRegulatedMultiHouse: {
    twoHouse: 0.01, // 2주택: 1~3% (일반 세율)
    threeOrMore: 0.08, // 3주택 이상: 8%
  },
  // 기타 부동산
  land: 0.04, // 토지: 4%
  commercial: 0.04, // 상업용: 4%
  officetel: 0.04, // 오피스텔: 4%
  // 부가세
  localEducationTax: 0.1, // 지방교육세: 취득세의 10%
  ruralSpecialTax: 0.02, // 농어촌특별세: 2% (85㎡ 초과 시)
} as const;

export interface AcquisitionTaxInput {
  propertyType: PropertyType; // 부동산 유형
  acquisitionPrice: number; // 취득가액
  houseCount?: HouseCount; // 주택 수 (주택인 경우)
  isRegulatedArea?: boolean; // 조정대상지역 여부
  isFirstTimeBuyer?: boolean; // 생애 최초 구매자 여부
  area?: number; // 전용면적 (㎡)
}

export interface AcquisitionTaxResult {
  acquisitionTax: number; // 취득세
  acquisitionTaxRate: number; // 취득세율
  localEducationTax: number; // 지방교육세
  ruralSpecialTax: number; // 농어촌특별세
  totalTax: number; // 총 세금
  breakdown: {
    label: string;
    rate: number;
    amount: number;
  }[];
}
