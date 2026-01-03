import type { BMIInput, BMIResult, BMICategory } from '../types/bmi';
import { BMI_CATEGORIES } from '../types/bmi';

export class BMICalculator {
  calculate(input: BMIInput): BMIResult {
    const { height, weight } = input;
    const heightM = height / 100; // cm to m

    // BMI 계산
    const bmi = weight / (heightM * heightM);

    // 분류 결정
    const category = this.getCategory(bmi);
    const categoryInfo = BMI_CATEGORIES[category];

    // 정상 체중 범위 계산
    const idealWeightRange = {
      min: Math.round(BMI_CATEGORIES.normal.min * heightM * heightM * 10) / 10,
      max: Math.round(BMI_CATEGORIES.normal.max * heightM * heightM * 10) / 10,
    };

    // 정상 범위와의 차이
    let weightDifference = 0;
    if (weight < idealWeightRange.min) {
      weightDifference = weight - idealWeightRange.min; // 음수: 증량 필요
    } else if (weight > idealWeightRange.max) {
      weightDifference = weight - idealWeightRange.max; // 양수: 감량 필요
    }

    // 건강 위험도
    const healthRisk = this.getHealthRisk(category);

    return {
      bmi: Math.round(bmi * 10) / 10,
      category,
      categoryLabel: categoryInfo.label,
      categoryColor: categoryInfo.color,
      categoryBgColor: categoryInfo.bgColor,
      idealWeightRange,
      weightDifference: Math.round(weightDifference * 10) / 10,
      healthRisk,
    };
  }

  private getCategory(bmi: number): BMICategory {
    if (bmi < BMI_CATEGORIES.underweight.max) return 'underweight';
    if (bmi < BMI_CATEGORIES.normal.max) return 'normal';
    if (bmi < BMI_CATEGORIES.overweight.max) return 'overweight';
    if (bmi < BMI_CATEGORIES.obese1.max) return 'obese1';
    return 'obese2';
  }

  private getHealthRisk(category: BMICategory): string {
    switch (category) {
      case 'underweight':
        return '영양 결핍, 면역력 저하 위험이 있습니다.';
      case 'normal':
        return '건강한 체중입니다. 현재 상태를 유지하세요.';
      case 'overweight':
        return '당뇨, 고혈압 위험이 증가할 수 있습니다.';
      case 'obese1':
        return '심혈관 질환, 당뇨병 위험이 높습니다.';
      case 'obese2':
        return '심각한 건강 문제 위험이 있습니다. 전문가 상담을 권장합니다.';
      default:
        return '';
    }
  }
}

export const bmiCalculator = new BMICalculator();
