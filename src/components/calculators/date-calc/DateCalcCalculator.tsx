"use client";

import { useState } from "react";

type CalcMode = "add" | "diff";

export function DateCalcCalculator() {
  const [mode, setMode] = useState<CalcMode>("add");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [years, setYears] = useState("0");
  const [months, setMonths] = useState("0");
  const [days, setDays] = useState("30");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const calculateAdd = () => {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return null;

    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;
    const d = parseInt(days) || 0;

    const result = new Date(start);
    if (operation === "add") {
      result.setFullYear(result.getFullYear() + y);
      result.setMonth(result.getMonth() + m);
      result.setDate(result.getDate() + d);
    } else {
      result.setFullYear(result.getFullYear() - y);
      result.setMonth(result.getMonth() - m);
      result.setDate(result.getDate() - d);
    }

    const diffTime = Math.abs(result.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      date: result,
      totalDays: diffDays,
    };
  };

  const calculateDiff = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const absYears = Math.floor(Math.abs(diffDays) / 365);
    const absMonths = Math.floor((Math.abs(diffDays) % 365) / 30);
    const absDays = Math.abs(diffDays) % 30;

    return {
      totalDays: diffDays,
      years: absYears,
      months: absMonths,
      days: absDays,
      weeks: Math.floor(Math.abs(diffDays) / 7),
    };
  };

  const formatDate = (date: Date) => {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
  };

  const addResult = mode === "add" ? calculateAdd() : null;
  const diffResult = mode === "diff" ? calculateDiff() : null;

  return (
    <div id="date-calc" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">날짜 계산기</h2>
          <p className="text-xs text-gray-500">날짜 더하기/빼기, 기간 계산</p>
        </div>
        <span className="text-2xl">🗓️</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode("add")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "add"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            날짜 더하기/빼기
          </button>
          <button
            onClick={() => setMode("diff")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "diff"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            두 날짜 사이 기간
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {mode === "add" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">기준 날짜</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setOperation("add")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  operation === "add"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                + 더하기
              </button>
              <button
                onClick={() => setOperation("subtract")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  operation === "subtract"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                - 빼기
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">년</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">개월</label>
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">일</label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작 날짜</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료 날짜</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </>
        )}
      </div>

      {mode === "add" && addResult && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">계산 결과</p>
          <p className="text-2xl font-bold mb-2">{formatDate(addResult.date)}</p>
          <p className="text-white/70 text-sm">
            {operation === "add" ? "+" : "-"}{years}년 {months}개월 {days}일 ({addResult.totalDays}일)
          </p>
        </div>
      )}

      {mode === "diff" && diffResult && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">기간</p>
          <p className="text-3xl font-bold mb-3">
            {Math.abs(diffResult.totalDays).toLocaleString()}
            <span className="text-lg ml-1 font-normal opacity-80">일</span>
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/70 text-xs">상세 기간</p>
              <p>{diffResult.years}년 {diffResult.months}개월 {diffResult.days}일</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">주 단위</p>
              <p>{diffResult.weeks}주 {Math.abs(diffResult.totalDays) % 7}일</p>
            </div>
          </div>
          {diffResult.totalDays < 0 && (
            <p className="text-white/60 text-xs mt-2">※ 종료일이 시작일보다 이전입니다</p>
          )}
        </div>
      )}
    </div>
  );
}
