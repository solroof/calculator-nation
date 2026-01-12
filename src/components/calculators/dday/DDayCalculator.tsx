"use client";

import { useState, useMemo } from "react";
import { DatePicker } from "@/components/ui/DatePicker";

export function DDayCalculator() {
  const [targetDate, setTargetDate] = useState("");
  const [eventName, setEventName] = useState("");

  const result = useMemo(() => {
    if (!targetDate) return null;

    const target = new Date(targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      days: Math.abs(diffDays),
      isPast: diffDays < 0,
      weeks: Math.floor(Math.abs(diffDays) / 7),
      months: Math.floor(Math.abs(diffDays) / 30),
    };
  }, [targetDate]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <div id="dday" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">D-Day 계산기</h2>
          <p className="text-xs text-gray-500">특별한 날까지 남은 일수</p>
        </div>
        <span className="text-2xl">📅</span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이벤트 이름 (선택)
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="예: 결혼기념일, 시험일"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            날짜 선택
          </label>
          <DatePicker
            value={targetDate}
            onChange={setTargetDate}
            placeholder="날짜를 선택하세요"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-5 text-white ${result.isPast ? "bg-gradient-to-br from-gray-500 to-gray-600" : "bg-gradient-to-br from-amber-500 to-orange-500"}`}>
            <p className="text-white/80 text-sm mb-1">
              {eventName || "선택한 날짜"}
            </p>
            <p className="text-3xl font-bold mb-2">
              {result.isPast ? `D+${result.days}` : result.days === 0 ? "D-Day!" : `D-${result.days}`}
            </p>
            <p className="text-white/70 text-sm">
              {formatDate(targetDate)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-500 text-xs">일</p>
              <p className="text-xl font-bold text-gray-800">{result.days}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-500 text-xs">주</p>
              <p className="text-xl font-bold text-gray-800">{result.weeks}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-gray-500 text-xs">개월</p>
              <p className="text-xl font-bold text-gray-800">{result.months}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
