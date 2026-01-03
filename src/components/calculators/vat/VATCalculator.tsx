"use client";

import { useState } from "react";

type CalcMode = "addVat" | "removeVat" | "calculateVat";

export function VATCalculator() {
  const [mode, setMode] = useState<CalcMode>("addVat");
  const [amount, setAmount] = useState("");
  const [vatRate] = useState(10);

  const calculate = () => {
    const value = parseFloat(amount);
    if (isNaN(value)) return null;

    switch (mode) {
      case "addVat":
        return {
          supply: value,
          vat: value * (vatRate / 100),
          total: value * (1 + vatRate / 100),
        };
      case "removeVat":
        return {
          total: value,
          supply: value / (1 + vatRate / 100),
          vat: value - value / (1 + vatRate / 100),
        };
      case "calculateVat":
        return {
          supply: value,
          vat: value * (vatRate / 100),
          total: value * (1 + vatRate / 100),
        };
    }
  };

  const result = calculate();
  const formatWon = (num: number) => Math.round(num).toLocaleString("ko-KR") + "원";

  const modes = [
    { id: "addVat", label: "VAT 포함", desc: "공급가 → 합계" },
    { id: "removeVat", label: "VAT 분리", desc: "합계 → 공급가" },
  ];

  return (
    <div id="vat" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">부가세(VAT) 계산기</h2>
          <p className="text-xs text-gray-500">부가가치세 10% 계산</p>
        </div>
        <span className="text-2xl">🧾</span>
      </div>

      <div className="flex gap-2 mb-4">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as CalcMode)}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              mode === m.id
                ? "bg-violet-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mode === "removeVat" ? "VAT 포함 금액 (합계)" : "공급가액 (VAT 별도)"}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-violet-500"
              placeholder="100,000"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
            <p className="text-white/80 text-sm mb-1">
              {mode === "removeVat" ? "공급가액" : "VAT 포함 합계"}
            </p>
            <p className="text-3xl font-bold">
              {formatWon(mode === "removeVat" ? result.supply : result.total)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">공급가액</span>
              <span className="font-medium">{formatWon(result.supply)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">부가세 (10%)</span>
              <span className="font-medium text-violet-600">+{formatWon(result.vat)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-800">합계</span>
              <span className="font-bold">{formatWon(result.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
