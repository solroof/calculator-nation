"use client";

import { useState } from "react";

export function CreditCardCalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [months, setMonths] = useState("12");
  const [rate, setRate] = useState("15");
  const [calcType, setCalcType] = useState<"installment" | "revolving">("installment");

  const calculate = () => {
    const p = parseFloat(principal) || 0;
    const n = parseInt(months) || 1;
    const annualRate = parseFloat(rate) || 0;
    const monthlyRate = annualRate / 100 / 12;

    if (calcType === "installment") {
      // 할부 계산 (원리금균등)
      if (monthlyRate === 0) {
        return {
          monthlyPayment: p / n,
          totalPayment: p,
          totalInterest: 0,
          schedule: [],
        };
      }

      const monthlyPayment = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) /
                             (Math.pow(1 + monthlyRate, n) - 1);
      const totalPayment = monthlyPayment * n;
      const totalInterest = totalPayment - p;

      // 상환 스케줄
      const schedule = [];
      let balance = p;
      for (let i = 1; i <= Math.min(n, 6); i++) {
        const interest = balance * monthlyRate;
        const principalPay = monthlyPayment - interest;
        balance -= principalPay;
        schedule.push({
          month: i,
          payment: Math.round(monthlyPayment),
          principal: Math.round(principalPay),
          interest: Math.round(interest),
          balance: Math.max(0, Math.round(balance)),
        });
      }

      return {
        monthlyPayment: Math.round(monthlyPayment),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        schedule,
      };
    } else {
      // 리볼빙 계산 (최소결제금액 방식)
      const minPaymentRate = 0.1; // 최소결제비율 10%
      const schedule = [];
      let balance = p;
      let totalInterest = 0;
      let totalPayment = 0;
      let month = 0;

      while (balance > 0 && month < 60) {
        month++;
        const interest = balance * monthlyRate;
        const minPayment = Math.max(balance * minPaymentRate, 10000);
        const payment = Math.min(minPayment, balance + interest);
        const principalPay = payment - interest;
        balance = Math.max(0, balance - principalPay);
        totalInterest += interest;
        totalPayment += payment;

        if (month <= 6) {
          schedule.push({
            month,
            payment: Math.round(payment),
            principal: Math.round(principalPay),
            interest: Math.round(interest),
            balance: Math.round(balance),
          });
        }
      }

      return {
        monthlyPayment: Math.round(totalPayment / month),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        totalMonths: month,
        schedule,
      };
    }
  };

  const result = calculate();

  return (
    <div id="credit-card" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">신용카드 이자 계산기</h2>
          <p className="text-xs text-gray-500">할부/리볼빙 이자 계산</p>
        </div>
        <span className="text-2xl">💳</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCalcType("installment")}
            className={`p-3 rounded-xl border-2 transition-all ${
              calcType === "installment"
                ? "border-violet-500 bg-violet-50 text-violet-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="font-medium">할부</p>
          </button>
          <button
            onClick={() => setCalcType("revolving")}
            className={`p-3 rounded-xl border-2 transition-all ${
              calcType === "revolving"
                ? "border-violet-500 bg-violet-50 text-violet-600"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="font-medium">리볼빙</p>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">결제 금액 (원)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 text-lg"
            placeholder="1000000"
          />
        </div>

        {calcType === "installment" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할부 개월</label>
            <select
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
            >
              {[2, 3, 6, 10, 12, 18, 24, 36].map((m) => (
                <option key={m} value={m}>{m}개월</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">연이율 (%)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
            placeholder="15"
          />
          <p className="text-xs text-gray-400 mt-1">카드사별 할부 수수료율 확인 필요</p>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">월 납입금</p>
            <p className="text-2xl font-bold">{result.monthlyPayment.toLocaleString()}원</p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">총 이자</p>
            <p className="text-2xl font-bold text-yellow-300">{result.totalInterest.toLocaleString()}원</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20 text-center">
          <p className="text-white/70 text-xs">총 상환금액</p>
          <p className="text-lg font-bold">{result.totalPayment.toLocaleString()}원</p>
          {"totalMonths" in result && (
            <p className="text-white/50 text-xs mt-1">완납까지 {result.totalMonths}개월</p>
          )}
        </div>
      </div>

      {result.schedule.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">상환 스케줄</p>
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">회차</th>
                  <th className="p-2 text-right">납입금</th>
                  <th className="p-2 text-right">원금</th>
                  <th className="p-2 text-right">이자</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.month} className="border-t border-gray-100">
                    <td className="p-2">{row.month}회</td>
                    <td className="p-2 text-right">{row.payment.toLocaleString()}</td>
                    <td className="p-2 text-right">{row.principal.toLocaleString()}</td>
                    <td className="p-2 text-right text-red-500">{row.interest.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
