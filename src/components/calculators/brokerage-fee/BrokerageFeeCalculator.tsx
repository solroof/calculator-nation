"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

type TransactionType = "sale" | "rent" | "jeonse";

export function BrokerageFeeCalculator() {
  const [transactionType, setTransactionType] = useState<TransactionType>("sale");
  const [price, setPrice] = useState<number>(50000);
  const [deposit, setDeposit] = useState<number>(30000);
  const [monthlyRent, setMonthlyRent] = useState<number>(100);

  const calculateFee = () => {
    let amount = 0;

    if (transactionType === "sale" || transactionType === "jeonse") {
      amount = (price || 0) * 10000; // 만원 단위
    } else {
      // 월세: 보증금 + (월세 × 100)
      const dep = (deposit || 0) * 10000;
      const rent = (monthlyRent || 0) * 10000;
      amount = dep + rent * 100;
      // 단, 5천만원 미만이면 보증금 + (월세 × 70)
      if (amount < 50000000) {
        amount = dep + rent * 70;
      }
    }

    if (isNaN(amount) || amount <= 0) return null;

    // 주택 중개보수 요율표 (2021년 개정)
    let rate = 0;
    let maxFee = 0;

    if (transactionType === "sale") {
      if (amount < 50000000) {
        rate = 0.006;
        maxFee = 250000;
      } else if (amount < 200000000) {
        rate = 0.005;
        maxFee = 800000;
      } else if (amount < 900000000) {
        rate = 0.004;
        maxFee = Infinity;
      } else if (amount < 1200000000) {
        rate = 0.005;
        maxFee = Infinity;
      } else if (amount < 1500000000) {
        rate = 0.006;
        maxFee = Infinity;
      } else {
        rate = 0.007;
        maxFee = Infinity;
      }
    } else {
      // 전세/월세
      if (amount < 50000000) {
        rate = 0.005;
        maxFee = 200000;
      } else if (amount < 100000000) {
        rate = 0.004;
        maxFee = 300000;
      } else if (amount < 600000000) {
        rate = 0.003;
        maxFee = Infinity;
      } else if (amount < 1200000000) {
        rate = 0.004;
        maxFee = Infinity;
      } else if (amount < 1500000000) {
        rate = 0.005;
        maxFee = Infinity;
      } else {
        rate = 0.006;
        maxFee = Infinity;
      }
    }

    const calculatedFee = amount * rate;
    const fee = maxFee !== Infinity ? Math.min(calculatedFee, maxFee) : calculatedFee;
    const vat = fee * 0.1;

    return {
      transactionAmount: amount,
      rate: rate * 100,
      maxFee: maxFee !== Infinity ? maxFee : null,
      fee: Math.round(fee),
      vat: Math.round(vat),
      totalFee: Math.round(fee + vat),
    };
  };

  const result = calculateFee();

  const types = [
    { key: "sale", label: "매매", icon: "🏠" },
    { key: "jeonse", label: "전세", icon: "📋" },
    { key: "rent", label: "월세", icon: "🔑" },
  ];

  return (
    <div id="brokerage-fee" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">부동산 중개수수료</h2>
          <p className="text-xs text-gray-500">중개보수 계산</p>
        </div>
        <span className="text-2xl">🤝</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2">
          {types.map((t) => (
            <button
              key={t.key}
              onClick={() => setTransactionType(t.key as TransactionType)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                transactionType === t.key
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {transactionType === "rent" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">보증금 (만원)</label>
              <NumberInput
                value={deposit}
                onChange={setDeposit}
                min={0}
                step={100}
                format="comma"
                suffix="만원"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">월세 (만원)</label>
              <NumberInput
                value={monthlyRent}
                onChange={setMonthlyRent}
                min={0}
                step={10}
                format="comma"
                suffix="만원"
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {transactionType === "sale" ? "매매가" : "전세금"} (만원)
            </label>
            <NumberInput
              value={price}
              onChange={setPrice}
              min={0}
              step={1000}
              format="comma"
              suffix="만원"
            />
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
            <p className="text-white/80 text-sm mb-1">예상 중개수수료 (VAT 포함)</p>
            <p className="text-3xl font-bold">
              {result.totalFee.toLocaleString()}
              <span className="text-lg ml-1 font-normal opacity-80">원</span>
            </p>
            <p className="text-white/70 text-sm mt-2">
              적용 요율: {result.rate}%
              {result.maxFee && ` (한도 ${result.maxFee.toLocaleString()}원)`}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">거래금액</span>
              <span className="font-medium">{result.transactionAmount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">중개보수</span>
              <span className="font-medium">{result.fee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">부가세 (10%)</span>
              <span className="font-medium">{result.vat.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 중개보수 = 거래금액 × 요율 (한도 적용)</p>
          <p>• 부가세 = 중개보수 × 10%</p>
          <p>• 월세 환산액 = 보증금 + (월세 × 100)</p>
          <p className="pl-3">※ 5천만원 미만: 보증금 + (월세 × 70)</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">2021년 개정 주택 중개보수 요율</p>
          <p>매매: 0.4~0.7% | 전세/월세: 0.3~0.6%</p>
          <p>상한 요율 내에서 협의 가능</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">공인중개사법 시행규칙 기준</p>
      </div>
    </div>
  );
}
