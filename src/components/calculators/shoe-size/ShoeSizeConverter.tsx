"use client";

import { useState } from "react";

// 신발 사이즈 변환 테이블 (mm 기준)
const sizeChart = [
  { mm: 220, kr: 220, us_m: 4, us_w: 5.5, eu: 35, uk: 2.5 },
  { mm: 225, kr: 225, us_m: 4.5, us_w: 6, eu: 35.5, uk: 3 },
  { mm: 230, kr: 230, us_m: 5, us_w: 6.5, eu: 36, uk: 3.5 },
  { mm: 235, kr: 235, us_m: 5.5, us_w: 7, eu: 37, uk: 4 },
  { mm: 240, kr: 240, us_m: 6, us_w: 7.5, eu: 37.5, uk: 4.5 },
  { mm: 245, kr: 245, us_m: 6.5, us_w: 8, eu: 38, uk: 5 },
  { mm: 250, kr: 250, us_m: 7, us_w: 8.5, eu: 39, uk: 5.5 },
  { mm: 255, kr: 255, us_m: 7.5, us_w: 9, eu: 40, uk: 6 },
  { mm: 260, kr: 260, us_m: 8, us_w: 9.5, eu: 40.5, uk: 6.5 },
  { mm: 265, kr: 265, us_m: 8.5, us_w: 10, eu: 41, uk: 7 },
  { mm: 270, kr: 270, us_m: 9, us_w: 10.5, eu: 42, uk: 7.5 },
  { mm: 275, kr: 275, us_m: 9.5, us_w: 11, eu: 42.5, uk: 8 },
  { mm: 280, kr: 280, us_m: 10, us_w: 11.5, eu: 43, uk: 8.5 },
  { mm: 285, kr: 285, us_m: 10.5, us_w: 12, eu: 44, uk: 9 },
  { mm: 290, kr: 290, us_m: 11, us_w: 12.5, eu: 44.5, uk: 9.5 },
  { mm: 295, kr: 295, us_m: 11.5, us_w: 13, eu: 45, uk: 10 },
  { mm: 300, kr: 300, us_m: 12, us_w: 13.5, eu: 46, uk: 10.5 },
  { mm: 305, kr: 305, us_m: 12.5, us_w: 14, eu: 46.5, uk: 11 },
  { mm: 310, kr: 310, us_m: 13, us_w: 14.5, eu: 47, uk: 11.5 },
];

export function ShoeSizeConverter() {
  const [krSize, setKrSize] = useState("260");
  const [gender, setGender] = useState<"male" | "female">("male");

  const findClosestSize = (size: number) => {
    let closest = sizeChart[0];
    let minDiff = Math.abs(size - closest.mm);

    for (const item of sizeChart) {
      const diff = Math.abs(size - item.mm);
      if (diff < minDiff) {
        minDiff = diff;
        closest = item;
      }
    }
    return closest;
  };

  const size = parseInt(krSize) || 260;
  const result = findClosestSize(size);

  return (
    <div id="shoe-size" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">신발 사이즈 변환</h2>
          <p className="text-xs text-gray-500">한국, 미국, 유럽, 영국</p>
        </div>
        <span className="text-2xl">👟</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGender("male")}
            className={`p-3 rounded-xl border-2 transition-all ${
              gender === "male"
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-200"
            }`}
          >
            <p className="font-medium">남성</p>
          </button>
          <button
            onClick={() => setGender("female")}
            className={`p-3 rounded-xl border-2 transition-all ${
              gender === "female"
                ? "border-pink-500 bg-pink-50 text-pink-600"
                : "border-gray-200"
            }`}
          >
            <p className="font-medium">여성</p>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            한국 사이즈 (mm)
          </label>
          <select
            value={krSize}
            onChange={(e) => setKrSize(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
          >
            {sizeChart.map((item) => (
              <option key={item.mm} value={item.mm}>
                {item.kr}mm
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`mt-6 rounded-xl p-5 text-white ${
        gender === "male"
          ? "bg-gradient-to-br from-blue-500 to-blue-600"
          : "bg-gradient-to-br from-pink-500 to-pink-600"
      }`}>
        <p className="text-white/70 text-sm mb-3 text-center">변환 결과</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-white/70 text-xs">미국 (US)</p>
            <p className="text-2xl font-bold">
              {gender === "male" ? result.us_m : result.us_w}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs">유럽 (EU)</p>
            <p className="text-2xl font-bold">{result.eu}</p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs">영국 (UK)</p>
            <p className="text-2xl font-bold">{result.uk}</p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs">한국 (mm)</p>
            <p className="text-2xl font-bold">{result.kr}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">사이즈 표</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="p-1 text-left">한국</th>
                <th className="p-1">US {gender === "male" ? "남" : "여"}</th>
                <th className="p-1">EU</th>
                <th className="p-1">UK</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.slice(0, 8).map((item) => (
                <tr key={item.mm} className={`border-b ${item.mm === result.mm ? "bg-blue-50" : ""}`}>
                  <td className="p-1">{item.kr}</td>
                  <td className="p-1 text-center">{gender === "male" ? item.us_m : item.us_w}</td>
                  <td className="p-1 text-center">{item.eu}</td>
                  <td className="p-1 text-center">{item.uk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        * 브랜드별로 사이즈가 다를 수 있습니다
      </p>
    </div>
  );
}
