"use client";

import { useState } from "react";

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState("50000");
  const [tipPercent, setTipPercent] = useState("10");
  const [people, setPeople] = useState("4");

  const calculate = () => {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercent);
    const numPeople = parseInt(people);

    if (isNaN(bill) || isNaN(tip) || isNaN(numPeople) || numPeople <= 0) return null;

    const tipAmount = bill * (tip / 100);
    const total = bill + tipAmount;
    const perPerson = total / numPeople;
    const tipPerPerson = tipAmount / numPeople;

    return {
      tipAmount: Math.round(tipAmount),
      total: Math.round(total),
      perPerson: Math.round(perPerson),
      tipPerPerson: Math.round(tipPerPerson),
      billPerPerson: Math.round(bill / numPeople),
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
          <label className="block text-sm font-medium text-gray-700 mb-1">총 금액 (원)</label>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 text-lg"
            placeholder="50000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">팁 (%)</label>
          <div className="flex gap-2 mb-2">
            {quickTips.map((t) => (
              <button
                key={t}
                onClick={() => setTipPercent(t.toString())}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  tipPercent === t.toString()
                    ? "bg-violet-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
          <input
            type="number"
            value={tipPercent}
            onChange={(e) => setTipPercent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
            placeholder="10"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">인원 수</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPeople(Math.max(1, parseInt(people) - 1).toString())}
              className="w-12 h-12 bg-gray-100 rounded-xl text-xl font-medium hover:bg-gray-200"
            >
              -
            </button>
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 text-center text-lg"
              min="1"
            />
            <button
              onClick={() => setPeople((parseInt(people) + 1).toString())}
              className="w-12 h-12 bg-gray-100 rounded-xl text-xl font-medium hover:bg-gray-200"
            >
              +
            </button>
          </div>
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
    </div>
  );
}
