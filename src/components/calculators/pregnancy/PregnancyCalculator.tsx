"use client";

import { useState } from "react";

type CalcMode = "lmp" | "dueDate";

export function PregnancyCalculator() {
  const [mode, setMode] = useState<CalcMode>("lmp");
  const [lmpDate, setLmpDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const calculateFromLMP = () => {
    if (!lmpDate) return null;

    const lmp = new Date(lmpDate);
    if (isNaN(lmp.getTime())) return null;

    // 출산 예정일: 마지막 생리일 + 280일 (40주)
    const due = new Date(lmp);
    due.setDate(due.getDate() + 280);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysSinceLMP = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(daysSinceLMP / 7);
    const days = daysSinceLMP % 7;

    const daysUntilDue = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const trimester = weeks < 12 ? 1 : weeks < 28 ? 2 : 3;

    return {
      dueDate: due,
      weeks,
      days,
      daysSinceLMP,
      daysUntilDue,
      trimester,
      progress: Math.min((daysSinceLMP / 280) * 100, 100),
    };
  };

  const calculateFromDueDate = () => {
    if (!dueDate) return null;

    const due = new Date(dueDate);
    if (isNaN(due.getTime())) return null;

    // 마지막 생리일 = 출산 예정일 - 280일
    const lmp = new Date(due);
    lmp.setDate(lmp.getDate() - 280);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysSinceLMP = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(daysSinceLMP / 7);
    const days = daysSinceLMP % 7;

    const daysUntilDue = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const trimester = weeks < 12 ? 1 : weeks < 28 ? 2 : 3;

    return {
      lmpDate: lmp,
      weeks,
      days,
      daysSinceLMP,
      daysUntilDue,
      trimester,
      progress: Math.min((daysSinceLMP / 280) * 100, 100),
    };
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const lmpResult = mode === "lmp" ? calculateFromLMP() : null;
  const dueDateResult = mode === "dueDate" ? calculateFromDueDate() : null;
  const result = lmpResult || dueDateResult;

  const getTrimesterLabel = (t: number) => {
    if (t === 1) return "초기 (1~12주)";
    if (t === 2) return "중기 (13~27주)";
    return "말기 (28~40주)";
  };

  return (
    <div id="pregnancy" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">임신 주수 계산기</h2>
          <p className="text-xs text-gray-500">출산 예정일 및 임신 주수</p>
        </div>
        <span className="text-2xl">🤰</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode("lmp")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "lmp"
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            마지막 생리일로
          </button>
          <button
            onClick={() => setMode("dueDate")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === "dueDate"
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            출산예정일로
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {mode === "lmp" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              마지막 생리 시작일 (LMP)
            </label>
            <input
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              출산 예정일
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
            />
          </div>
        )}
      </div>

      {result && result.weeks >= 0 && (
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">현재 임신 주수</p>
              <p className="text-3xl font-bold">
                {result.weeks}주 {result.days}일
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">{getTrimesterLabel(result.trimester)}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>진행률</span>
              <span>{result.progress.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${result.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {mode === "lmp" && lmpResult && (
              <div>
                <p className="text-white/70 text-xs">출산 예정일</p>
                <p className="font-medium">{formatDate(lmpResult.dueDate)}</p>
              </div>
            )}
            {mode === "dueDate" && dueDateResult && (
              <div>
                <p className="text-white/70 text-xs">마지막 생리일</p>
                <p className="font-medium">{formatDate(dueDateResult.lmpDate)}</p>
              </div>
            )}
            <div>
              <p className="text-white/70 text-xs">출산까지</p>
              <p className="font-medium">
                {result.daysUntilDue > 0 ? `D-${result.daysUntilDue}` : `D+${Math.abs(result.daysUntilDue)}`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">임신 주수 참고</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 초기 (1~12주): 주요 장기 형성</p>
          <p>• 중기 (13~27주): 태동 느끼기 시작</p>
          <p>• 말기 (28~40주): 출산 준비</p>
          <p className="text-gray-400 mt-2">※ 정확한 정보는 의사와 상담하세요</p>
        </div>
      </div>
    </div>
  );
}
