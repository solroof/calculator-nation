"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

type CarType = "passenger" | "electric" | "hybrid" | "commercial";

export function CarTaxCalculator() {
  const [carType, setCarType] = useState<CarType>("passenger");
  const [cc, setCc] = useState<number>(2000);
  const [year, setYear] = useState<number>(2020);

  const calculateTax = () => {
    const ccNum = cc || 0;
    const yearNum = year || 2020;
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - yearNum;


    // 비영업용 승용차 기준
    let baseTax = 0;

    if (carType === "electric") {
      // 전기차 고정 세금
      baseTax = 130000;
    } else if (carType === "hybrid") {
      // 하이브리드 (배기량 기준)
      if (ccNum <= 1000) {
        baseTax = ccNum * 80;
      } else if (ccNum <= 1600) {
        baseTax = ccNum * 140;
      } else {
        baseTax = ccNum * 200;
      }
      baseTax = baseTax * 0.6; // 하이브리드 40% 감면
    } else if (carType === "commercial") {
      // 영업용
      if (ccNum <= 1000) {
        baseTax = 18000;
      } else if (ccNum <= 1600) {
        baseTax = 18000 + (ccNum - 1000) * 18;
      } else {
        baseTax = 28800 + (ccNum - 1600) * 19;
      }
    } else {
      // 일반 승용차 (비영업용)
      if (ccNum <= 1000) {
        baseTax = ccNum * 80;
      } else if (ccNum <= 1600) {
        baseTax = ccNum * 140;
      } else {
        baseTax = ccNum * 200;
      }
    }

    // 차령에 따른 경감률
    let reductionRate = 0;
    if (carAge >= 3 && carAge < 4) reductionRate = 0.05;
    else if (carAge >= 4 && carAge < 5) reductionRate = 0.1;
    else if (carAge >= 5 && carAge < 6) reductionRate = 0.15;
    else if (carAge >= 6 && carAge < 7) reductionRate = 0.2;
    else if (carAge >= 7 && carAge < 8) reductionRate = 0.25;
    else if (carAge >= 8 && carAge < 9) reductionRate = 0.3;
    else if (carAge >= 9 && carAge < 10) reductionRate = 0.35;
    else if (carAge >= 10 && carAge < 11) reductionRate = 0.4;
    else if (carAge >= 11 && carAge < 12) reductionRate = 0.45;
    else if (carAge >= 12) reductionRate = 0.5;

    const reducedTax = Math.round(baseTax * (1 - reductionRate));
    const educationTax = Math.round(reducedTax * 0.3);
    const totalTax = reducedTax + educationTax;

    return {
      baseTax: Math.round(baseTax),
      reductionRate: reductionRate * 100,
      reducedTax,
      educationTax,
      totalTax,
      halfYearTax: Math.round(totalTax / 2),
      carAge,
    };
  };

  const result = calculateTax();

  const carTypes = [
    { key: "passenger", label: "일반 승용차", icon: "🚗" },
    { key: "electric", label: "전기차", icon: "⚡" },
    { key: "hybrid", label: "하이브리드", icon: "🔋" },
    { key: "commercial", label: "영업용", icon: "🚕" },
  ];

  return (
    <div id="car-tax" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">자동차세 계산기</h2>
          <p className="text-xs text-gray-500">연간 자동차세 계산</p>
        </div>
        <span className="text-2xl">🚙</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">차량 종류</p>
        <div className="grid grid-cols-2 gap-2">
          {carTypes.map((t) => (
            <button
              key={t.key}
              onClick={() => setCarType(t.key as CarType)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                carType === t.key
                  ? "bg-slate-600 text-white"
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
        {carType !== "electric" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">배기량 (cc)</label>
            <NumberInput
              value={cc}
              onChange={setCc}
              min={0}
              step={100}
              format="comma"
              suffix="cc"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">차량 연식 (년도)</label>
          <NumberInput
            value={year}
            onChange={setYear}
            min={1990}
            max={new Date().getFullYear()}
            step={1}
            format="none"
            suffix="년"
          />
        </div>
      </div>

      {result && (
        <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">연간 자동차세</p>
          <p className="text-3xl font-bold mb-4">
            {result.totalTax.toLocaleString()}
            <span className="text-lg ml-1 font-normal opacity-80">원</span>
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">기본 세액</span>
              <span>{result.baseTax.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">차령 경감 ({result.reductionRate}%)</span>
              <span>-{(result.baseTax - result.reducedTax).toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">지방교육세 (30%)</span>
              <span>+{result.educationTax.toLocaleString()}원</span>
            </div>
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-white/70">6월/12월 납부 (반기별)</span>
                <span>{result.halfYearTax.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 기본세액 = 배기량(cc) × 세액(원/cc)</p>
          <p>• 경감세액 = 기본세액 × (1 - 차령경감률)</p>
          <p>• 지방교육세 = 경감세액 × 30%</p>
          <p>• 총 세액 = 경감세액 + 지방교육세</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">배기량별 세액 (비영업용)</p>
          <p>1,000cc 이하: 80원/cc | 1,600cc 이하: 140원/cc | 초과: 200원/cc</p>
          <p className="mt-1">전기차: 연 13만원 (고정)</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200 space-y-1">
          <p>• 6월/12월 2회 분납, 1월 연납 시 약 9.15% 할인</p>
          <p>• 차령 3년 이상부터 매년 5%씩 경감 (최대 50%)</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">지방세법 기준</p>
      </div>
    </div>
  );
}
