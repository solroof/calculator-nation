// 만 나이 계산기 타입 정의

export interface AgeInput {
  birthDate: string; // YYYY-MM-DD
  baseDate?: string; // 기준일 (기본값: 오늘)
}

export interface AgeResult {
  koreanAge: number; // 한국 나이
  internationalAge: number; // 만 나이
  months: number; // 만 나이 개월
  days: number; // 만 나이 일
  totalDays: number; // 총 일수
  nextBirthday: {
    date: string;
    daysUntil: number;
  };
  zodiac: {
    animal: string; // 띠
    element: string; // 오행
  };
  constellation: string; // 별자리
}
