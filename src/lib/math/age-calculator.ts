import type { AgeInput, AgeResult } from '../types/age';

// 띠 (12지신)
const ZODIAC_ANIMALS = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
// 오행
const ZODIAC_ELEMENTS = ['금', '금', '수', '수', '목', '목', '화', '화', '토', '토'];

// 별자리
const CONSTELLATIONS = [
  { name: '염소자리', start: [1, 1], end: [1, 19] },
  { name: '물병자리', start: [1, 20], end: [2, 18] },
  { name: '물고기자리', start: [2, 19], end: [3, 20] },
  { name: '양자리', start: [3, 21], end: [4, 19] },
  { name: '황소자리', start: [4, 20], end: [5, 20] },
  { name: '쌍둥이자리', start: [5, 21], end: [6, 21] },
  { name: '게자리', start: [6, 22], end: [7, 22] },
  { name: '사자자리', start: [7, 23], end: [8, 22] },
  { name: '처녀자리', start: [8, 23], end: [9, 22] },
  { name: '천칭자리', start: [9, 23], end: [10, 22] },
  { name: '전갈자리', start: [10, 23], end: [11, 21] },
  { name: '사수자리', start: [11, 22], end: [12, 21] },
  { name: '염소자리', start: [12, 22], end: [12, 31] },
];

export class AgeCalculator {
  calculate(input: AgeInput): AgeResult {
    const { birthDate, baseDate } = input;
    const birth = new Date(birthDate);
    const base = baseDate ? new Date(baseDate) : new Date();

    // 만 나이 계산
    let internationalAge = base.getFullYear() - birth.getFullYear();
    const monthDiff = base.getMonth() - birth.getMonth();
    const dayDiff = base.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      internationalAge--;
    }

    // 한국 나이
    const koreanAge = base.getFullYear() - birth.getFullYear() + 1;

    // 개월 수 계산
    let months = base.getMonth() - birth.getMonth();
    if (dayDiff < 0) months--;
    if (months < 0) months += 12;

    // 일 수 계산
    let days = dayDiff;
    if (days < 0) {
      const lastMonth = new Date(base.getFullYear(), base.getMonth(), 0);
      days += lastMonth.getDate();
    }

    // 총 일수
    const totalDays = Math.floor((base.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    // 다음 생일
    const nextBirthday = this.getNextBirthday(birth, base);

    // 띠
    const zodiac = this.getZodiac(birth.getFullYear());

    // 별자리
    const constellation = this.getConstellation(birth.getMonth() + 1, birth.getDate());

    return {
      koreanAge,
      internationalAge,
      months,
      days,
      totalDays,
      nextBirthday,
      zodiac,
      constellation,
    };
  }

  private getNextBirthday(birth: Date, base: Date) {
    const thisYearBirthday = new Date(base.getFullYear(), birth.getMonth(), birth.getDate());
    let nextBirthday = thisYearBirthday;

    if (thisYearBirthday <= base) {
      nextBirthday = new Date(base.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }

    const daysUntil = Math.ceil((nextBirthday.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));

    return {
      date: nextBirthday.toISOString().split('T')[0],
      daysUntil,
    };
  }

  private getZodiac(year: number) {
    const animal = ZODIAC_ANIMALS[year % 12];
    const element = ZODIAC_ELEMENTS[year % 10];
    return { animal, element };
  }

  private getConstellation(month: number, day: number) {
    for (const c of CONSTELLATIONS) {
      const [startMonth, startDay] = c.start;
      const [endMonth, endDay] = c.end;

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return c.name;
      }
    }
    return '염소자리';
  }
}

export const ageCalculator = new AgeCalculator();
