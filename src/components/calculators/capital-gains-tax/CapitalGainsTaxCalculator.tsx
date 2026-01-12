"use client";

import { useState, useMemo } from "react";
import { capitalGainsTaxCalculator } from "@/lib/math/capital-gains-tax-calculator";
import type { CapitalGainsTaxInput, PropertyType, HouseCount } from "@/lib/types/capital-gains-tax";
import { DatePicker, MoneyInput, NumberInput } from "@/components/ui";

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "아파트" },
  { value: "house", label: "주택/빌라" },
  { value: "land", label: "토지" },
  { value: "commercial", label: "상가/상업용" },
];

export function CapitalGainsTaxCalculator() {
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [acquisitionPrice, setAcquisitionPrice] = useState<number>(500000000);
  const [sellingPrice, setSellingPrice] = useState<number>(700000000);
  const [acquisitionDate, setAcquisitionDate] = useState<string>("2020-01-01");
  const [sellingDate, setSellingDate] = useState<string>("2024-01-01");
  const [expenses, setExpenses] = useState<number>(10000000);
  const [houseCount, setHouseCount] = useState<HouseCount>(1);
  const [isRegulatedArea, setIsRegulatedArea] = useState<boolean>(false);
  const [residenceYears, setResidenceYears] = useState<number>(2);
  const [isOneHouseExemption, setIsOneHouseExemption] = useState<boolean>(false);

  const isHousing = propertyType === "house" || propertyType === "apartment";

  const result = useMemo(() => {
    const acqPrice = acquisitionPrice || 0;
    const sellPrice = sellingPrice || 0;
    const exp = expenses || 0;

    if (acqPrice <= 0 || sellPrice <= 0) return null;

    const input: CapitalGainsTaxInput = {
      propertyType,
      acquisitionPrice: acqPrice,
      sellingPrice: sellPrice,
      acquisitionDate,
      sellingDate,
      expenses: exp,
      houseCount: isHousing ? houseCount : undefined,
      isRegulatedArea: isHousing ? isRegulatedArea : undefined,
      residenceYears: isHousing ? (residenceYears || 0) : undefined,
      isOneHouseExemption: isHousing && houseCount === 1 ? isOneHouseExemption : undefined,
    };

    return capitalGainsTaxCalculator.calculate(input);
  }, [
    propertyType, acquisitionPrice, sellingPrice, acquisitionDate,
    sellingDate, expenses, houseCount, isRegulatedArea,
    residenceYears, isOneHouseExemption, isHousing
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(Math.abs(value));
  };

  const formatRate = (rate: number) => {
    return (rate * 100).toFixed(1);
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        양도소득세 계산기
      </h2>

      {/* 입력 폼 */}
      <div className="space-y-4 mb-6">
        {/* 부동산 유형 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            부동산 유형
          </label>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setPropertyType(type.value)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  propertyType === type.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 취득가액 & 양도가액 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              취득가액
            </label>
            <MoneyInput
              value={acquisitionPrice}
              onChange={setAcquisitionPrice}
              min={0}
              step={10000000}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              양도가액
            </label>
            <MoneyInput
              value={sellingPrice}
              onChange={setSellingPrice}
              min={0}
              step={10000000}
            />
          </div>
        </div>

        {/* 취득일 & 양도일 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              취득일
            </label>
            <DatePicker
              value={acquisitionDate}
              onChange={setAcquisitionDate}
              placeholder="취득일 선택"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              양도일
            </label>
            <DatePicker
              value={sellingDate}
              onChange={setSellingDate}
              placeholder="양도일 선택"
            />
          </div>
        </div>

        {/* 필요경비 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            필요경비 (취득세, 중개수수료 등)
          </label>
          <MoneyInput
            value={expenses}
            onChange={setExpenses}
            min={0}
            step={1000000}
          />
        </div>

        {/* 주택인 경우 추가 옵션 */}
        {isHousing && (
          <>
            {/* 주택 수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                양도 당시 보유 주택 수
              </label>
              <div className="flex gap-2">
                {([1, 2, 3] as HouseCount[]).map((count) => (
                  <button
                    key={count}
                    onClick={() => setHouseCount(count)}
                    className={`flex-1 px-4 py-2 text-sm rounded-lg border transition-colors ${
                      houseCount === count
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {count === 3 ? "3주택 이상" : `${count}주택`}
                  </button>
                ))}
              </div>
            </div>

            {/* 1주택자 옵션 */}
            {houseCount === 1 && (
              <>
                {/* 거주 기간 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    거주 기간 (년)
                  </label>
                  <NumberInput
                    value={residenceYears}
                    onChange={setResidenceYears}
                    min={0}
                    max={30}
                    step={1}
                    format="none"
                    suffix="년"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    2년 이상 거주 시 장기보유특별공제 추가 적용
                  </p>
                </div>

                {/* 1세대 1주택 비과세 */}
                <div className="bg-green-50 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOneHouseExemption}
                      onChange={(e) => setIsOneHouseExemption(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <span className="font-medium text-gray-800">1세대 1주택 비과세 적용</span>
                      <p className="text-xs text-gray-500 mt-1">
                        2년 이상 보유+거주 시 12억 이하 비과세, 초과분만 과세
                      </p>
                    </div>
                  </label>
                </div>
              </>
            )}

            {/* 조정대상지역 (다주택자) */}
            {houseCount >= 2 && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRegulatedArea}
                    onChange={(e) => setIsRegulatedArea(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">조정대상지역</span>
                    <p className="text-xs text-gray-500 mt-1">
                      2주택: +20%p, 3주택 이상: +30%p 중과
                    </p>
                  </div>
                </label>
              </div>
            )}
          </>
        )}
      </div>

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          {/* 총 세금 */}
          <div className={`rounded-xl p-4 text-white ${
            result.totalTax === 0
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : "bg-gradient-to-r from-blue-500 to-blue-600"
          }`}>
            <div className="text-sm opacity-90 mb-1">총 납부 세금</div>
            <div className="text-2xl font-bold">
              {formatCurrency(result.totalTax)}원
            </div>
            <div className="text-sm opacity-80 mt-1">
              {result.appliedRate.description}
              {result.effectiveRate > 0 && ` (실효세율 ${formatRate(result.effectiveRate)}%)`}
            </div>
          </div>

          {/* 보유 기간 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">
              보유 기간: <span className="font-medium text-gray-800">
                {result.holdingPeriod.years}년 {result.holdingPeriod.months}개월
              </span>
            </div>
          </div>

          {/* 세금 상세 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">계산 내역</span>
            </div>
            <div className="divide-y divide-gray-200">
              {result.breakdown.map((item, index) => (
                <div key={index} className="px-4 py-2 flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className={`text-sm font-medium ${
                    item.amount < 0 ? "text-red-600" : "text-gray-800"
                  }`}>
                    {item.amount < 0 ? "-" : ""}{formatCurrency(item.amount)}원
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 계산 공식 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• 양도차익 = 양도가액 - 취득가액 - 필요경비</p>
              <p>• 장기보유특별공제 = 양도차익 × 공제율 (보유/거주기간별)</p>
              <p>• 과세표준 = 양도차익 - 장기보유특별공제 - 기본공제(250만원)</p>
              <p>• 양도소득세 = 과세표준 × 세율 - 누진공제</p>
              <p>• 지방소득세 = 양도소득세 × 10%</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">2024년 소득세법 기준 · 실제 세금은 개인 상황에 따라 다를 수 있음</p>
          </div>
        </div>
      )}
    </div>
  );
}
