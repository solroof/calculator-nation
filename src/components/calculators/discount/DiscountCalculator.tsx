"use client";

import { useState } from "react";
import { MoneyInput, PercentInput } from "@/components/ui";

type CalcMode = "discountPrice" | "discountRate";

export function DiscountCalculator() {
  const [mode, setMode] = useState<CalcMode>("discountPrice");
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);

  const calculate = () => {
    if (mode === "discountPrice") {
      if (originalPrice > 0 && discountRate >= 0) {
        return {
          discountAmount: originalPrice * (discountRate / 100),
          finalPrice: originalPrice * (1 - discountRate / 100),
        };
      }
    } else {
      if (originalPrice > 0 && salePrice >= 0) {
        const discountAmount = originalPrice - salePrice;
        return {
          discountAmount,
          discountRate: (discountAmount / originalPrice) * 100,
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
          <MoneyInput
            value={originalPrice}
            onChange={setOriginalPrice}
            placeholder="정가 입력"
          />
        </div>

        {mode === "discountPrice" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인율
            </label>
            <PercentInput
              value={discountRate}
              onChange={setDiscountRate}
              max={100}
              step={1}
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인된 가격 (판매가)
            </label>
            <MoneyInput
              value={salePrice}
              onChange={setSalePrice}
              placeholder="판매가 입력"
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
              <span className="font-medium">{formatWon(originalPrice)}</span>
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

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 할인가 = 정가 × (1 - 할인율/100)</p>
              <p>• 할인 금액 = 정가 × 할인율/100</p>
              <p>• 할인율 = (정가 - 판매가) / 정가 × 100</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
