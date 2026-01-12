"use client";

import { useState } from "react";
import { MoneyInput, PercentInput, NumberInput } from "@/components/ui";

export function StockReturnCalculator() {
  const [buyPrice, setBuyPrice] = useState<number>(50000);
  const [sellPrice, setSellPrice] = useState<number>(65000);
  const [quantity, setQuantity] = useState<number>(10);
  const [buyFee, setBuyFee] = useState<number>(0.015);
  const [sellFee, setSellFee] = useState<number>(0.015);
  const [tax, setTax] = useState<number>(0.23);

  const calculate = () => {
    const buyFeeRate = buyFee / 100;
    const sellFeeRate = sellFee / 100;
    const taxRate = tax / 100;

    const totalBuy = buyPrice * quantity;
    const totalSell = sellPrice * quantity;
    const buyFeeAmount = totalBuy * buyFeeRate;
    const sellFeeAmount = totalSell * sellFeeRate;
    const taxAmount = totalSell * taxRate;

    const grossProfit = totalSell - totalBuy;
    const totalFees = buyFeeAmount + sellFeeAmount + taxAmount;
    const netProfit = grossProfit - totalFees;
    const returnRate = totalBuy > 0 ? (netProfit / totalBuy) * 100 : 0;

    return {
      totalBuy,
      totalSell,
      buyFeeAmount,
      sellFeeAmount,
      taxAmount,
      grossProfit,
      totalFees,
      netProfit,
      returnRate,
    };
  };

  const result = calculate();

  return (
    <div id="stock-return" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">주식 수익률 계산기</h2>
          <p className="text-xs text-gray-500">수수료/세금 포함 실제 수익</p>
        </div>
        <span className="text-2xl">📈</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매수가</label>
            <MoneyInput
              value={buyPrice}
              onChange={setBuyPrice}
              step={1000}
              placeholder="매수가 입력"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매도가</label>
            <MoneyInput
              value={sellPrice}
              onChange={setSellPrice}
              step={1000}
              placeholder="매도가 입력"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">수량</label>
          <NumberInput
            value={quantity}
            onChange={setQuantity}
            min={1}
            step={1}
            format="comma"
            suffix="주"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매수 수수료</label>
            <PercentInput
              value={buyFee}
              onChange={setBuyFee}
              max={10}
              step={0.001}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매도 수수료</label>
            <PercentInput
              value={sellFee}
              onChange={setSellFee}
              max={10}
              step={0.001}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">세금</label>
            <PercentInput
              value={tax}
              onChange={setTax}
              max={10}
              step={0.01}
            />
          </div>
        </div>
      </div>

      <div className={`mt-6 rounded-xl p-5 text-white ${result.netProfit >= 0 ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-red-600"}`}>
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">순수익 (세후)</p>
          <p className="text-3xl font-bold">
            {result.netProfit >= 0 ? "+" : ""}{Math.round(result.netProfit).toLocaleString()}원
          </p>
          <p className={`text-lg font-semibold mt-1 ${result.returnRate >= 0 ? "text-white" : "text-white"}`}>
            수익률 {result.returnRate >= 0 ? "+" : ""}{result.returnRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">총 매수금액</span>
          <span className="font-medium">{result.totalBuy.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">총 매도금액</span>
          <span className="font-medium">{result.totalSell.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">매매차익</span>
          <span className={`font-medium ${result.grossProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {result.grossProfit >= 0 ? "+" : ""}{result.grossProfit.toLocaleString()}원
          </span>
        </div>
        <div className="p-3 bg-orange-50 rounded-xl">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">총 비용</span>
            <span className="font-medium text-orange-600">-{Math.round(result.totalFees).toLocaleString()}원</span>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>매수 수수료</span>
              <span>{Math.round(result.buyFeeAmount).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span>매도 수수료</span>
              <span>{Math.round(result.sellFeeAmount).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span>거래세</span>
              <span>{Math.round(result.taxAmount).toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 매매차익 = 매도금액 - 매수금액</p>
          <p>• 순수익 = 매매차익 - 수수료 - 세금</p>
          <p>• 수익률 = 순수익 ÷ 매수금액 × 100</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">2024년 기준</p>
          <p>• 증권사 수수료: 약 0.015%</p>
          <p>• 거래세: 코스피 0.18%, 코스닥 0.23%</p>
        </div>
      </div>
    </div>
  );
}
