"use client";

import { useState } from "react";

const exchangeRates: Record<string, { name: string; rate: number; symbol: string }> = {
  KRW: { name: "한국 원", rate: 1, symbol: "₩" },
  USD: { name: "미국 달러", rate: 0.00075, symbol: "$" },
  EUR: { name: "유로", rate: 0.00069, symbol: "€" },
  JPY: { name: "일본 엔", rate: 0.11, symbol: "¥" },
  CNY: { name: "중국 위안", rate: 0.0054, symbol: "¥" },
  GBP: { name: "영국 파운드", rate: 0.00059, symbol: "£" },
  AUD: { name: "호주 달러", rate: 0.00116, symbol: "A$" },
  CAD: { name: "캐나다 달러", rate: 0.00102, symbol: "C$" },
  CHF: { name: "스위스 프랑", rate: 0.00066, symbol: "CHF" },
  HKD: { name: "홍콩 달러", rate: 0.00585, symbol: "HK$" },
  SGD: { name: "싱가포르 달러", rate: 0.001, symbol: "S$" },
  THB: { name: "태국 바트", rate: 0.026, symbol: "฿" },
  VND: { name: "베트남 동", rate: 18.5, symbol: "₫" },
};

export function CurrencyCalculator() {
  const [amount, setAmount] = useState("1000000");
  const [fromCurrency, setFromCurrency] = useState("KRW");
  const [toCurrency, setToCurrency] = useState("USD");

  const convert = () => {
    const amt = parseFloat(amount) || 0;
    const fromRate = exchangeRates[fromCurrency].rate;
    const toRate = exchangeRates[toCurrency].rate;
    return (amt * toRate) / fromRate;
  };

  const reverseConvert = () => {
    const amt = parseFloat(amount) || 0;
    const fromRate = exchangeRates[fromCurrency].rate;
    const toRate = exchangeRates[toCurrency].rate;
    return (amt * fromRate) / toRate;
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const result = convert();
  const reverseResult = reverseConvert();

  return (
    <div id="currency" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">환율 계산기</h2>
          <p className="text-xs text-gray-500">통화 환전 계산 (참고용)</p>
        </div>
        <span className="text-2xl">💱</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">금액</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 text-lg"
            placeholder="금액 입력"
          />
        </div>

        <div className="grid grid-cols-5 gap-2 items-center">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">변환 전</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
            >
              {Object.entries(exchangeRates).map(([code, info]) => (
                <option key={code} value={code}>
                  {code} ({info.name})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="통화 교환"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">변환 후</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
            >
              {Object.entries(exchangeRates).map(([code, info]) => (
                <option key={code} value={code}>
                  {code} ({info.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white">
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">변환 결과</p>
          <p className="text-3xl font-bold">
            {exchangeRates[toCurrency].symbol} {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-white/70 text-sm mt-2">
            {exchangeRates[fromCurrency].symbol} {parseFloat(amount || "0").toLocaleString()} {exchangeRates[fromCurrency].name}
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-600 mb-2">환율 정보 (1 {fromCurrency} 기준)</p>
        <p className="text-lg font-semibold text-gray-800">
          = {(exchangeRates[toCurrency].rate / exchangeRates[fromCurrency].rate).toFixed(6)} {toCurrency}
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        * 환율은 참고용이며 실제 환율과 다를 수 있습니다
      </p>
    </div>
  );
}
