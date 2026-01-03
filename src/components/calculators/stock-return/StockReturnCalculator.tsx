"use client";

import { useState } from "react";

export function StockReturnCalculator() {
  const [buyPrice, setBuyPrice] = useState("50000");
  const [sellPrice, setSellPrice] = useState("65000");
  const [quantity, setQuantity] = useState("10");
  const [buyFee, setBuyFee] = useState("0.015");
  const [sellFee, setSellFee] = useState("0.015");
  const [tax, setTax] = useState("0.23");

  const calculate = () => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const qty = parseInt(quantity) || 0;
    const buyFeeRate = parseFloat(buyFee) / 100;
    const sellFeeRate = parseFloat(sellFee) / 100;
    const taxRate = parseFloat(tax) / 100;

    const totalBuy = buy * qty;
    const totalSell = sell * qty;
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
            <label className="block text-sm font-medium text-gray-700 mb-1">매수가 (원)</label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              placeholder="50000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매도가 (원)</label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              placeholder="65000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">수량 (주)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
            placeholder="10"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매수 수수료 (%)</label>
            <input
              type="number"
              step="0.001"
              value={buyFee}
              onChange={(e) => setBuyFee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">매도 수수료 (%)</label>
            <input
              type="number"
              step="0.001"
              value={sellFee}
              onChange={(e) => setSellFee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">세금 (%)</label>
            <input
              type="number"
              step="0.01"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
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
    </div>
  );
}
