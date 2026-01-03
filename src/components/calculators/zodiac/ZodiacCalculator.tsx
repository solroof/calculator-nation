"use client";

import { useState } from "react";

const zodiacSigns = [
  { name: "물병자리", symbol: "♒", start: [1, 20], end: [2, 18], element: "공기", english: "Aquarius" },
  { name: "물고기자리", symbol: "♓", start: [2, 19], end: [3, 20], element: "물", english: "Pisces" },
  { name: "양자리", symbol: "♈", start: [3, 21], end: [4, 19], element: "불", english: "Aries" },
  { name: "황소자리", symbol: "♉", start: [4, 20], end: [5, 20], element: "땅", english: "Taurus" },
  { name: "쌍둥이자리", symbol: "♊", start: [5, 21], end: [6, 21], element: "공기", english: "Gemini" },
  { name: "게자리", symbol: "♋", start: [6, 22], end: [7, 22], element: "물", english: "Cancer" },
  { name: "사자자리", symbol: "♌", start: [7, 23], end: [8, 22], element: "불", english: "Leo" },
  { name: "처녀자리", symbol: "♍", start: [8, 23], end: [9, 22], element: "땅", english: "Virgo" },
  { name: "천칭자리", symbol: "♎", start: [9, 23], end: [10, 23], element: "공기", english: "Libra" },
  { name: "전갈자리", symbol: "♏", start: [10, 24], end: [11, 22], element: "물", english: "Scorpio" },
  { name: "사수자리", symbol: "♐", start: [11, 23], end: [12, 21], element: "불", english: "Sagittarius" },
  { name: "염소자리", symbol: "♑", start: [12, 22], end: [1, 19], element: "땅", english: "Capricorn" },
];

const chineseZodiac = [
  { name: "쥐", emoji: "🐀", years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020] },
  { name: "소", emoji: "🐂", years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021] },
  { name: "호랑이", emoji: "🐅", years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022] },
  { name: "토끼", emoji: "🐇", years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023] },
  { name: "용", emoji: "🐉", years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024] },
  { name: "뱀", emoji: "🐍", years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025] },
  { name: "말", emoji: "🐴", years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026] },
  { name: "양", emoji: "🐏", years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027] },
  { name: "원숭이", emoji: "🐵", years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028] },
  { name: "닭", emoji: "🐓", years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029] },
  { name: "개", emoji: "🐕", years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030] },
  { name: "돼지", emoji: "🐖", years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031] },
];

export function ZodiacCalculator() {
  const [birthDate, setBirthDate] = useState("");

  const calculate = () => {
    if (!birthDate) return null;

    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return null;

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    // 별자리 계산
    let zodiac = zodiacSigns.find((z) => {
      if (z.name === "염소자리") {
        return (month === 12 && day >= 22) || (month === 1 && day <= 19);
      }
      const [startMonth, startDay] = z.start;
      const [endMonth, endDay] = z.end;
      return (month === startMonth && day >= startDay) || (month === endMonth && day <= endDay);
    });

    if (!zodiac) zodiac = zodiacSigns[0];

    // 띠 계산
    const zodiacIndex = (year - 4) % 12;
    const chinese = chineseZodiac[zodiacIndex];

    return { zodiac, chinese, year };
  };

  const result = calculate();

  const elementColors: Record<string, string> = {
    "불": "from-red-500 to-orange-500",
    "땅": "from-amber-600 to-yellow-600",
    "공기": "from-cyan-500 to-blue-500",
    "물": "from-blue-600 to-indigo-600",
  };

  return (
    <div id="zodiac" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">별자리/띠 계산기</h2>
          <p className="text-xs text-gray-500">생년월일로 확인</p>
        </div>
        <span className="text-2xl">⭐</span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`bg-gradient-to-br ${elementColors[result.zodiac.element]} rounded-2xl p-5 text-white`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm">별자리</p>
              <span className="text-3xl">{result.zodiac.symbol}</span>
            </div>
            <p className="text-3xl font-bold">{result.zodiac.name}</p>
            <p className="text-white/70 text-sm mt-1">{result.zodiac.english}</p>
            <div className="mt-3 flex gap-2">
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {result.zodiac.element} 속성
              </span>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {result.zodiac.start[0]}월 {result.zodiac.start[1]}일 ~ {result.zodiac.end[0]}월 {result.zodiac.end[1]}일
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-sm">띠</p>
              <span className="text-3xl">{result.chinese.emoji}</span>
            </div>
            <p className="text-3xl font-bold">{result.chinese.name}띠</p>
            <p className="text-white/70 text-sm mt-1">{result.year}년생</p>
            <div className="mt-3">
              <p className="text-white/60 text-xs">
                같은 띠: {result.chinese.years.filter(y => y !== result.year).slice(-4).join(", ")}년생
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">12간지 순서</p>
        <div className="flex flex-wrap gap-1">
          {chineseZodiac.map((z) => (
            <span key={z.name} className="text-lg" title={z.name}>
              {z.emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
