import type { BMRInput, BMRResult } from '../types/bmr';
import { ACTIVITY_LEVELS } from '../types/bmr';

export class BMRCalculator {
  calculate(input: BMRInput): BMRResult {
    const { gender, age, height, weight, activityLevel } = input;

    // Mifflin-St Jeor 공식으로 BMR 계산
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    bmr = Math.round(bmr);

    // TDEE (총 일일 에너지 소비량)
    const tdee = Math.round(bmr * ACTIVITY_LEVELS[activityLevel].multiplier);

    // 매크로 계산
    const macros = {
      weightLoss: this.calculateMacros(tdee - 500, weight), // 500kcal 적자
      maintenance: this.calculateMacros(tdee, weight),
      weightGain: this.calculateMacros(tdee + 500, weight), // 500kcal 잉여
    };

    return {
      bmr,
      tdee,
      activityLevel,
      macros,
    };
  }

  private calculateMacros(calories: number, weight: number) {
    // 단백질: 체중 kg당 1.6g
    const protein = Math.round(weight * 1.6);
    // 지방: 총 칼로리의 25%
    const fat = Math.round((calories * 0.25) / 9);
    // 탄수화물: 나머지
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

    return { calories, protein, carbs, fat };
  }
}

export const bmrCalculator = new BMRCalculator();
