"use client";

import { useState } from "react";
import { MoneyInput, PercentInput, NumberInput } from "@/components/ui";

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState<number>(50000);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [people, setPeople] = useState<number>(4);

  const calculate = () => {
    if (billAmount <= 0 || tipPercent < 0 || people <= 0) return null;

    const tipAmount = billAmount * (tipPercent / 100);
    const total = billAmount + tipAmount;
    const perPerson = total / people;
    const tipPerPerson = tipAmount / people;

    return {
      tipAmount: Math.round(tipAmount),
      total: Math.round(total),
      perPerson: Math.round(perPerson),
      tipPerPerson: Math.round(tipPerPerson),
      billPerPerson: Math.round(billAmount / people),
    };
  };

  const result = calculate();

  const quickTips = [5, 10, 15, 20];

  return (
    <div id="tip" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">팁/더치페이 계산기</h2>
          <p className="text-xs text-gray-500">N빵 계산</p>
        </div>
        <span className="text-2xl">💳</span>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">총 금액</label>
          <MoneyInput
            value={billAmount}
            onChange={setBillAmount}
            step={10000}
            placeholder="총 금액 입력"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">팁 (%)</label>
          <div className="flex gap-2 mb-2">
            {quickTips.map((t) => (
              <button
                key={t}
                onClick={() => setTipPercent(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  tipPercent === t
                    ? "bg-violet-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
          <PercentInput
            value={tipPercent}
            onChange={setTipPercent}
            max={100}
            step={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">인원 수</label>
          <NumberInput
            value={people}
            onChange={setPeople}
            min={1}
            max={100}
            step={1}
            format="none"
            suffix="명"
          />
        </div>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">1인당 금액</p>
          <p className="text-3xl font-bold mb-4">
            {result.perPerson.toLocaleString()}
            <span className="text-lg ml-1 font-normal opacity-80">원</span>
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs">총 금액</p>
              <p className="font-bold">{result.total.toLocaleString()}원</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs">팁 금액</p>
              <p className="font-bold">{result.tipAmount.toLocaleString()}원</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs">1인당 원금</p>
              <p className="font-bold">{result.billPerPerson.toLocaleString()}원</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs">1인당 팁</p>
              <p className="font-bold">{result.tipPerPerson.toLocaleString()}원</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 팁 금액 = 총 금액 × 팁률(%)</p>
          <p>• 총 지불액 = 총 금액 + 팁 금액</p>
          <p>• 1인당 금액 = 총 지불액 ÷ 인원 수</p>
          <p>• 1인당 팁 = 팁 금액 ÷ 인원 수</p>
        </div>
      </div>
    </div>
  );
}
