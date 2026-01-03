"use client";

import { useState, useEffect } from "react";

const timezones = [
  { key: "KST", name: "한국 (서울)", offset: 9 },
  { key: "JST", name: "일본 (도쿄)", offset: 9 },
  { key: "CST", name: "중국 (베이징)", offset: 8 },
  { key: "SGT", name: "싱가포르", offset: 8 },
  { key: "ICT", name: "태국 (방콕)", offset: 7 },
  { key: "IST", name: "인도 (뉴델리)", offset: 5.5 },
  { key: "GST", name: "두바이", offset: 4 },
  { key: "MSK", name: "러시아 (모스크바)", offset: 3 },
  { key: "CET", name: "유럽 중부 (파리)", offset: 1 },
  { key: "GMT", name: "영국 (런던)", offset: 0 },
  { key: "EST", name: "미국 동부 (뉴욕)", offset: -5 },
  { key: "CST_US", name: "미국 중부 (시카고)", offset: -6 },
  { key: "MST", name: "미국 산악 (덴버)", offset: -7 },
  { key: "PST", name: "미국 서부 (LA)", offset: -8 },
  { key: "AKST", name: "알래스카", offset: -9 },
  { key: "HST", name: "하와이", offset: -10 },
  { key: "NZST", name: "뉴질랜드", offset: 12 },
  { key: "AEST", name: "호주 동부 (시드니)", offset: 10 },
];

export function TimezoneConverter() {
  const [fromZone, setFromZone] = useState("KST");
  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("00");
  const [date, setDate] = useState("");

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
  }, []);

  const convert = (targetOffset: number) => {
    const fromOffset = timezones.find((tz) => tz.key === fromZone)?.offset || 9;
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;

    const totalMinutes = h * 60 + m;
    const diffMinutes = (targetOffset - fromOffset) * 60;
    let targetMinutes = totalMinutes + diffMinutes;

    let dayDiff = 0;
    if (targetMinutes < 0) {
      dayDiff = -1;
      targetMinutes += 24 * 60;
    } else if (targetMinutes >= 24 * 60) {
      dayDiff = 1;
      targetMinutes -= 24 * 60;
    }

    const targetHours = Math.floor(targetMinutes / 60);
    const targetMins = targetMinutes % 60;

    return {
      time: `${String(targetHours).padStart(2, "0")}:${String(targetMins).padStart(2, "0")}`,
      dayDiff,
    };
  };

  return (
    <div id="timezone" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">시간대 변환</h2>
          <p className="text-xs text-gray-500">세계 시간 변환</p>
        </div>
        <span className="text-2xl">🌍</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">기준 시간대</label>
          <select
            value={fromZone}
            onChange={(e) => setFromZone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
          >
            {timezones.map((tz) => (
              <option key={tz.key} value={tz.key}>
                {tz.name} (UTC{tz.offset >= 0 ? "+" : ""}{tz.offset})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              min="0"
              max="23"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">분</label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              min="0"
              max="59"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg text-center"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
        <p className="text-white/70 text-sm mb-2 text-center">
          {timezones.find((tz) => tz.key === fromZone)?.name} 기준
        </p>
        <p className="text-3xl font-bold text-center">
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
        </p>
      </div>

      <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
        {timezones
          .filter((tz) => tz.key !== fromZone)
          .map((tz) => {
            const result = convert(tz.offset);
            return (
              <div
                key={tz.key}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{tz.name}</p>
                  <p className="text-xs text-gray-500">
                    UTC{tz.offset >= 0 ? "+" : ""}{tz.offset}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">{result.time}</p>
                  {result.dayDiff !== 0 && (
                    <p className="text-xs text-orange-500">
                      {result.dayDiff > 0 ? "+1일" : "-1일"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        * 서머타임은 반영되지 않습니다
      </p>
    </div>
  );
}
