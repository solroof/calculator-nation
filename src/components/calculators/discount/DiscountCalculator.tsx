"use client";

import { useState } from "react";

type CalcMode = "discountPrice" | "discountRate";

export function DiscountCalculator() {
  const [mode, setMode] = useState<CalcMode>("discountPrice");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [salePrice, setSalePrice] = useState("");

  const calculate = () => {
    if (mode === "discountPrice") {
      const price = parseFloat(originalPrice);
      const rate = parseFloat(discountRate);
      if (!isNaN(price) && !isNaN(rate)) {
        return {
          discountAmount: price * (rate / 100),
          finalPrice: price * (1 - rate / 100),
        };
      }
    } else {
      const original = parseFloat(originalPrice);
      const sale = parseFloat(salePrice);
      if (!isNaN(original) && !isNaN(sale) && original > 0) {
        const discountAmount = original - sale;
        return {
          discountAmount,
          discountRate: (discountAmount / original) * 100,
        };
      }
    }
    return null;
  };

  const result = calculate();

  const formatWon = (num: number) => Math.round(num).toLocaleString("ko-KR") + "원";

  return (
    <div id="discount" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">할인율 계산기</h2>
          <p className="text-xs text-gray-500">할인가 또는 할인율 계산</p>
        </div>
        <span className="text-2xl">🏷️</span>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("discountPrice")}
          className={`flex-1 py-2 rounded-lg text-sm transition-all ${
            mode === "discountPrice"
              ? "bg-violet-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          할인가 계산
        </button>
        <button
          onClick={() => setMode("discountRate")}
          className={`flex-1 py-2 rounded-lg text-sm transition-all ${
            mode === "discountRate"
              ? "bg-violet-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          할인율 계산
        </button>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            정가 (원래 가격)
          </label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
            placeholder="50,000"
          />
        </div>

        {mode === "discountPrice" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인율 (%)
            </label>
            <input
              type="number"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
              placeholder="20"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인된 가격 (판매가)
            </label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
              placeholder="40,000"
            />
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
            <p className="text-white/80 text-sm mb-1">
              {mode === "discountPrice" ? "할인된 가격" : "할인율"}
            </p>
            <p className="text-3xl font-bold">
              {mode === "discountPrice"
                ? formatWon(result.finalPrice!)
                : `${result.discountRate!.toFixed(1)}%`}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">정가</span>
              <span className="font-medium">{formatWon(parseFloat(originalPrice))}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>할인 금액</span>
              <span className="font-medium">-{formatWon(result.discountAmount)}</span>
            </div>
            {mode === "discountPrice" && (
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-800">최종 가격</span>
                <span className="font-bold text-violet-600">{formatWon(result.finalPrice!)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
