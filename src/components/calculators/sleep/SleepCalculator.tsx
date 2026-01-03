"use client";

import { useState } from "react";

type CalcMode = "wakeup" | "sleep";

export function SleepCalculator() {
  const [mode, setMode] = useState<CalcMode>("wakeup");
  const [hour, setHour] = useState("7");
  const [minute, setMinute] = useState("0");

  const calculateCycles = () => {
    const h = parseInt(hour);
    const m = parseInt(minute);
    if (isNaN(h) || isNaN(m)) return null;

    const targetTime = new Date();
    targetTime.setHours(h, m, 0, 0);

    // 수면 사이클: 90분
    // 잠드는 시간: 약 15분
    const cycleMinutes = 90;
    const fallAsleepMinutes = 15;

    const times: { time: Date; cycles: number; hours: number }[] = [];

    if (mode === "wakeup") {
      // 기상 시간 기준으로 잠자리에 들 시간 계산
      for (let cycles = 6; cycles >= 3; cycles--) {
        const sleepTime = new Date(targetTime);
        sleepTime.setMinutes(
          sleepTime.getMinutes() - cycles * cycleMinutes - fallAsleepMinutes
        );
        times.push({
          time: sleepTime,
          cycles,
          hours: (cycles * cycleMinutes) / 60,
        });
      }
    } else {
      // 취침 시간 기준으로 기상 시간 계산
      const sleepStart = new Date(targetTime);
      sleepStart.setMinutes(sleepStart.getMinutes() + fallAsleepMinutes);

      for (let cycles = 3; cycles <= 6; cycles++) {
        const wakeTime = new Date(sleepStart);
        wakeTime.setMinutes(wakeTime.getMinutes() + cycles * cycleMinutes);
        times.push({
          time: wakeTime,
          cycles,
          hours: (cycles * cycleMinutes) / 60,
        });
      }
    }

    return times;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "오후" : "오전";
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${period} ${displayHour}:${minutes.toString().padStart(2, "0")}`;
  };

  const result = calculateCycles();

  return (
    <div id="sleep" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">수면 사이클 계산기</h2>
          <p className="text-xs text-gray-500">최적의 기상/취침 시간</p>
        </div>
        <span className="text-2xl">😴</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode("wakeup")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "wakeup"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🌅 기상 시간 입력
          </button>
          <button
            onClick={() => setMode("sleep")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "sleep"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🌙 취침 시간 입력
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === "wakeup" ? "일어나야 할 시간" : "잠자리에 드는 시간"}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <input
              type="number"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg text-center"
              min="0"
              max="23"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">시</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg text-center"
              min="0"
              max="59"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">분</span>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-3">
            {mode === "wakeup" ? "잠자리에 들 시간" : "일어날 시간"}
          </p>
          <div className="space-y-3">
            {result.map(({ time, cycles, hours }, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  cycles === 5 || cycles === 6
                    ? "bg-white/20 ring-2 ring-white/50"
                    : "bg-white/10"
                }`}
              >
                <div>
                  <p className="text-xl font-bold">{formatTime(time)}</p>
                  <p className="text-white/70 text-xs">
                    {hours}시간 수면 ({cycles}사이클)
                  </p>
                </div>
                {(cycles === 5 || cycles === 6) && (
                  <span className="text-xs bg-white/30 px-2 py-1 rounded-full">추천</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">수면 사이클이란?</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 1 사이클 = 약 90분 (얕은 수면 → 깊은 수면 → REM 수면)</p>
          <p>• 사이클이 끝나는 시점에 일어나면 개운함</p>
          <p>• 권장 수면: 5~6 사이클 (7.5~9시간)</p>
          <p>• 잠드는 데 평균 15분 소요</p>
        </div>
      </div>
    </div>
  );
}
