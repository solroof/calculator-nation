"use client";

import { useState } from "react";

// 2024년 기준 증여세율
const taxRates = [
  { min: 0, max: 100000000, rate: 10, deduction: 0 },
  { min: 100000000, max: 500000000, rate: 20, deduction: 10000000 },
  { min: 500000000, max: 1000000000, rate: 30, deduction: 60000000 },
  { min: 1000000000, max: 3000000000, rate: 40, deduction: 160000000 },
  { min: 3000000000, max: Infinity, rate: 50, deduction: 460000000 },
];

// 증여재산공제 (10년간 합산)
const exemptions: Record<string, number> = {
  spouse: 600000000,      // 배우자
  adult_child: 50000000,  // 성년 직계비속
  minor_child: 20000000,  // 미성년 직계비속
  parent: 50000000,       // 직계존속
  other: 10000000,        // 기타 친족
  none: 0,                // 비친족
};

export function GiftTaxCalculator() {
  const [amount, setAmount] = useState("100000000");
  const [relationship, setRelationship] = useState("adult_child");
  const [priorGifts, setPriorGifts] = useState("0");

  const calculate = () => {
    const giftAmount = parseFloat(amount) || 0;
    const prior = parseFloat(priorGifts) || 0;
    const exemption = exemptions[relationship];

    // 과세표준 = 증여재산 + 10년 내 증여 - 공제
    const totalGift = giftAmount + prior;
    const taxBase = Math.max(0, totalGift - exemption);

    // 세율 적용
    let tax = 0;
    for (const bracket of taxRates) {
      if (taxBase > bracket.min) {
        tax = taxBase * (bracket.rate / 100) - bracket.deduction;
        if (taxBase <= bracket.max) break;
      }
    }

    // 신고세액공제 (3%)
    const reportDiscount = tax * 0.03;
    const finalTax = Math.max(0, tax - reportDiscount);

    return {
      giftAmount,
      totalGift,
      exemption,
      taxBase,
      calculatedTax: Math.round(tax),
      reportDiscount: Math.round(reportDiscount),
      finalTax: Math.round(finalTax),
      effectiveRate: totalGift > 0 ? (finalTax / totalGift) * 100 : 0,
    };
  };

  const result = calculate();

  const relationships = [
    { key: "spouse", label: "배우자", exemptionText: "6억" },
    { key: "adult_child", label: "성년 자녀", exemptionText: "5천만" },
    { key: "minor_child", label: "미성년 자녀", exemptionText: "2천만" },
    { key: "parent", label: "부모님", exemptionText: "5천만" },
    { key: "other", label: "기타 친족", exemptionText: "1천만" },
    { key: "none", label: "비친족", exemptionText: "없음" },
  ];

  return (
    <div id="gift-tax" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">증여세 계산기</h2>
          <p className="text-xs text-gray-500">2024년 기준 증여세 계산</p>
        </div>
        <span className="text-2xl">🎁</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">증여 금액 (원)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-lg"
            placeholder="100000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">수증자와의 관계</label>
          <div className="grid grid-cols-2 gap-2">
            {relationships.map((rel) => (
              <button
                key={rel.key}
                onClick={() => setRelationship(rel.key)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  relationship === rel.key
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className={`font-medium text-sm ${relationship === rel.key ? "text-emerald-600" : "text-gray-700"}`}>
                  {rel.label}
                </p>
                <p className="text-xs text-gray-500">공제 {rel.exemptionText}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            10년 내 기증여액 (원)
          </label>
          <input
            type="number"
            value={priorGifts}
            onChange={(e) => setPriorGifts(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            placeholder="0"
          />
          <p className="text-xs text-gray-400 mt-1">동일인으로부터 10년 내 받은 증여액</p>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">납부할 증여세</p>
          <p className="text-3xl font-bold">{result.finalTax.toLocaleString()}원</p>
          <p className="text-white/70 text-sm mt-1">
            실효세율 {result.effectiveRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">증여재산가액</span>
          <span className="font-medium">{result.totalGift.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">증여재산공제</span>
          <span className="font-medium text-emerald-600">-{result.exemption.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">과세표준</span>
          <span className="font-medium">{result.taxBase.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">산출세액</span>
          <span className="font-medium">{result.calculatedTax.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-emerald-50 rounded-xl">
          <span className="text-gray-600">신고세액공제 (3%)</span>
          <span className="font-medium text-emerald-600">-{result.reportDiscount.toLocaleString()}원</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        * 신고기한 내 자진신고 시 3% 공제 적용
      </p>
    </div>
  );
}
