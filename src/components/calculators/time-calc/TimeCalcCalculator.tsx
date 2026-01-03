"use client";

import { useState } from "react";

type CalcMode = "add" | "diff" | "convert";

export function TimeCalcCalculator() {
  const [mode, setMode] = useState<CalcMode>("add");
  const [hours1, setHours1] = useState("9");
  const [minutes1, setMinutes1] = useState("0");
  const [hours2, setHours2] = useState("18");
  const [minutes2, setMinutes2] = useState("30");
  const [addHours, setAddHours] = useState("2");
  const [addMinutes, setAddMinutes] = useState("30");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [totalMinutes, setTotalMinutes] = useState("90");

  const calculateAdd = () => {
    const h = parseInt(hours1) || 0;
    const m = parseInt(minutes1) || 0;
    const addH = parseInt(addHours) || 0;
    const addM = parseInt(addMinutes) || 0;

    let totalMins = h * 60 + m;
    if (operation === "add") {
      totalMins += addH * 60 + addM;
    } else {
      totalMins -= addH * 60 + addM;
    }

    const resultHours = Math.floor(Math.abs(totalMins) / 60);
    const resultMins = Math.abs(totalMins) % 60;
    const isNegative = totalMins < 0;

    return {
      hours: resultHours,
      minutes: resultMins,
      isNegative,
      totalMinutes: Math.abs(totalMins),
    };
  };

  const calculateDiff = () => {
    const h1 = parseInt(hours1) || 0;
    const m1 = parseInt(minutes1) || 0;
    const h2 = parseInt(hours2) || 0;
    const m2 = parseInt(minutes2) || 0;

    const total1 = h1 * 60 + m1;
    const total2 = h2 * 60 + m2;
    const diff = total2 - total1;

    const hours = Math.floor(Math.abs(diff) / 60);
    const mins = Math.abs(diff) % 60;

    return {
      hours,
      minutes: mins,
      totalMinutes: Math.abs(diff),
      isNegative: diff < 0,
    };
  };

  const calculateConvert = () => {
    const mins = parseInt(totalMinutes) || 0;

    return {
      hours: Math.floor(mins / 60),
      minutes: mins % 60,
      seconds: mins * 60,
      days: (mins / 60 / 24).toFixed(2),
    };
  };

  const formatTime = (hours: number, minutes: number, isNegative?: boolean) => {
    const h = hours.toString().padStart(2, "0");
    const m = minutes.toString().padStart(2, "0");
    return `${isNegative ? "-" : ""}${h}:${m}`;
  };

  return (
    <div id="time-calc" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">시간 계산기</h2>
          <p className="text-xs text-gray-500">시간 더하기/빼기, 변환</p>
        </div>
        <span className="text-2xl">⏰</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMode("add")}
            className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === "add"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            시간 더하기/빼기
          </button>
          <button
            onClick={() => setMode("diff")}
            className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === "diff"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            시간 차이
          </button>
          <button
            onClick={() => setMode("convert")}
            className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === "convert"
                ? "bg-amber-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            단위 변환
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {mode === "add" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">기준 시간</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    value={hours1}
                    onChange={(e) => setHours1(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    min="0"
                    max="23"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">시</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={minutes1}
                    onChange={(e) => setMinutes1(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    min="0"
                    max="59"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">분</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setOperation("add")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  operation === "add" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                + 더하기
              </button>
              <button
                onClick={() => setOperation("subtract")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  operation === "subtract" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-700"
                }`}
              >
                - 빼기
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  value={addHours}
                  onChange={(e) => setAddHours(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">시간</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={addMinutes}
                  onChange={(e) => setAddMinutes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  min="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">분</span>
              </div>
            </div>
          </>
        )}

        {mode === "diff" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    value={hours1}
                    onChange={(e) => setHours1(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    min="0"
                    max="23"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">시</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={minutes1}
                    onChange={(e) => setMinutes1(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    min="0"
                    max="59"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">분</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    value={hours2}
                    onChange={(e) => setHours2(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    min="0"
                    max="23"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">시</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={minutes2}
                    onChange={(e) => setMinutes2(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    min="0"
                    max="59"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">분</span>
                </div>
              </div>
            </div>
          </>
        )}

        {mode === "convert" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">분 입력</label>
            <input
              type="number"
              value={totalMinutes}
              onChange={(e) => setTotalMinutes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-lg"
              placeholder="분 단위로 입력"
              min="0"
            />
          </div>
        )}
      </div>

      {mode === "add" && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">계산 결과</p>
          {(() => {
            const result = calculateAdd();
            return (
              <>
                <p className="text-3xl font-bold">
                  {formatTime(result.hours, result.minutes, result.isNegative)}
                </p>
                <p className="text-white/70 text-sm mt-2">
                  총 {result.totalMinutes.toLocaleString()}분
                </p>
              </>
            );
          })()}
        </div>
      )}

      {mode === "diff" && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">시간 차이</p>
          {(() => {
            const result = calculateDiff();
            return (
              <>
                <p className="text-3xl font-bold">
                  {result.hours}시간 {result.minutes}분
                </p>
                <p className="text-white/70 text-sm mt-2">
                  총 {result.totalMinutes.toLocaleString()}분
                  {result.isNegative && " (종료 시간이 더 이름)"}
                </p>
              </>
            );
          })()}
        </div>
      )}

      {mode === "convert" && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-2">변환 결과</p>
          {(() => {
            const result = calculateConvert();
            return (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-white/70 text-xs">시:분</p>
                  <p className="text-xl font-bold">{result.hours}시간 {result.minutes}분</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs">초</p>
                  <p className="text-xl font-bold">{result.seconds.toLocaleString()}초</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs">일</p>
                  <p className="text-xl font-bold">{result.days}일</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
