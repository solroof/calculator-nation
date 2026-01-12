"use client";

import { useState, useEffect } from "react";

// 지원 통화 목록
const currencies: Record<string, { name: string; symbol: string }> = {
  krw: { name: "한국 원", symbol: "₩" },
  usd: { name: "미국 달러", symbol: "$" },
  eur: { name: "유로", symbol: "€" },
  jpy: { name: "일본 엔", symbol: "¥" },
  cny: { name: "중국 위안", symbol: "¥" },
  gbp: { name: "영국 파운드", symbol: "£" },
  aud: { name: "호주 달러", symbol: "A$" },
  cad: { name: "캐나다 달러", symbol: "C$" },
  chf: { name: "스위스 프랑", symbol: "CHF" },
  hkd: { name: "홍콩 달러", symbol: "HK$" },
  sgd: { name: "싱가포르 달러", symbol: "S$" },
  thb: { name: "태국 바트", symbol: "฿" },
  vnd: { name: "베트남 동", symbol: "₫" },
  twd: { name: "대만 달러", symbol: "NT$" },
  php: { name: "필리핀 페소", symbol: "₱" },
  inr: { name: "인도 루피", symbol: "₹" },
  myr: { name: "말레이시아 링깃", symbol: "RM" },
  idr: { name: "인도네시아 루피아", symbol: "Rp" },
};

export function CurrencyCalculator() {
  const [amount, setAmount] = useState("1000000");
  const [fromCurrency, setFromCurrency] = useState("krw");
  const [toCurrency, setToCurrency] = useState("usd");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // 환율 데이터 가져오기
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setError(null);

      const primaryUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
      const fallbackUrl = "https://latest.currency-api.pages.dev/v1/currencies/usd.json";

      try {
        let response = await fetch(primaryUrl);

        if (!response.ok) {
          response = await fetch(fallbackUrl);
        }

        if (!response.ok) {
          throw new Error("환율 정보를 가져올 수 없습니다");
        }

        const data = await response.json();

        // USD 기준 환율을 저장
        const usdRates = data.usd;
        setRates(usdRates);
        setLastUpdated(data.date);
        setLoading(false);
      } catch {
        setError("환율 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convert = () => {
    if (!rates) return 0;
    const amt = parseFloat(amount) || 0;

    // USD 기준으로 변환
    // from -> USD -> to
    const fromToUsd = fromCurrency === "usd" ? 1 : 1 / rates[fromCurrency];
    const usdToTo = toCurrency === "usd" ? 1 : rates[toCurrency];

    return amt * fromToUsd * usdToTo;
  };

  const getRate = () => {
    if (!rates) return 0;
    const fromToUsd = fromCurrency === "usd" ? 1 : 1 / rates[fromCurrency];
    const usdToTo = toCurrency === "usd" ? 1 : rates[toCurrency];
    return fromToUsd * usdToTo;
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const result = convert();
  const rate = getRate();

  return (
    <div id="currency" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">환율 계산기</h2>
          <p className="text-xs text-gray-500">실시간 환율 적용</p>
        </div>
        <span className="text-2xl">💱</span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">환율 정보를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            새로고침
          </button>
        </div>
      ) : (
        <>
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
                  {Object.entries(currencies).map(([code, info]) => (
                    <option key={code} value={code}>
                      {code.toUpperCase()} ({info.name})
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
                  {Object.entries(currencies).map(([code, info]) => (
                    <option key={code} value={code}>
                      {code.toUpperCase()} ({info.name})
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
                {currencies[toCurrency].symbol} {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-white/70 text-sm mt-2">
                {currencies[fromCurrency].symbol} {parseFloat(amount || "0").toLocaleString()} {currencies[fromCurrency].name}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-2">환율 정보 (1 {fromCurrency.toUpperCase()} 기준)</p>
            <p className="text-lg font-semibold text-gray-800">
              = {rate.toFixed(6)} {toCurrency.toUpperCase()}
            </p>
          </div>

          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-4 text-center flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              실시간 환율 ({lastUpdated} 기준)
            </p>
          )}

          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 변환금액 = 원화 × (1/원화환율) × 대상통화환율</p>
              <p>• 모든 환율은 USD 기준으로 계산</p>
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
              <p className="font-medium mb-1">데이터 출처</p>
              <p>• Fawaz Ahmed Currency API (실시간)</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
