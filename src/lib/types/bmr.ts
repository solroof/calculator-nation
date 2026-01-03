// BMR 기초대사량 계산기 타입 정의

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

export const ACTIVITY_LEVELS = {
  sedentary: { multiplier: 1.2, label: '비활동적', description: '운동 거의 안함' },
  light: { multiplier: 1.375, label: '가벼운 활동', description: '주 1-3회 운동' },
  moderate: { multiplier: 1.55, label: '보통 활동', description: '주 3-5회 운동' },
  active: { multiplier: 1.725, label: '활동적', description: '주 6-7회 운동' },
  'very-active': { multiplier: 1.9, label: '매우 활동적', description: '고강도 운동/육체 노동' },
} as const;

export interface BMRInput {
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
}

export interface BMRResult {
  bmr: number; // 기초대사량
  tdee: number; // 총 일일 에너지 소비량
  activityLevel: ActivityLevel;
  macros: {
    weightLoss: { calories: number; protein: number; carbs: number; fat: number };
    maintenance: { calories: number; protein: number; carbs: number; fat: number };
    weightGain: { calories: number; protein: number; carbs: number; fat: number };
  };
}
