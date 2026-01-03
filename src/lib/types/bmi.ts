// BMI 계산기 타입 정의

// BMI 분류 (아시아-태평양 기준)
export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2';

export const BMI_CATEGORIES = {
  underweight: { min: 0, max: 18.5, label: '저체중', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  normal: { min: 18.5, max: 23, label: '정상', color: 'text-green-600', bgColor: 'bg-green-100' },
  overweight: { min: 23, max: 25, label: '과체중', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  obese1: { min: 25, max: 30, label: '비만', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  obese2: { min: 30, max: Infinity, label: '고도비만', color: 'text-red-600', bgColor: 'bg-red-100' },
} as const;

export interface BMIInput {
  height: number; // 키 (cm)
  weight: number; // 몸무게 (kg)
}

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryLabel: string;
  categoryColor: string;
  categoryBgColor: string;
  idealWeightRange: {
    min: number;
    max: number;
  };
  weightDifference: number; // 정상 범위와의 차이 (양수: 감량 필요, 음수: 증량 필요)
  healthRisk: string;
}
