"use client";

import { useState, useMemo } from "react";
import { acquisitionTaxCalculator } from "@/lib/math/acquisition-tax-calculator";
import type { AcquisitionTaxInput, PropertyType, HouseCount } from "@/lib/types/acquisition-tax";

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "아파트" },
  { value: "house", label: "주택/빌라" },
  { value: "officetel", label: "오피스텔" },
  { value: "land", label: "토지" },
  { value: "commercial", label: "상가/상업용" },
];

export function AcquisitionTaxCalculator() {
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [acquisitionPrice, setAcquisitionPrice] = useState<string>("500000000");
  const [houseCount, setHouseCount] = useState<HouseCount>(1);
  const [isRegulatedArea, setIsRegulatedArea] = useState<boolean>(false);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState<boolean>(false);
  const [area, setArea] = useState<string>("84");

  const isHousing = propertyType === "house" || propertyType === "apartment";

  const result = useMemo(() => {
    const price = parseInt(acquisitionPrice) || 0;
    if (price <= 0) return null;

    const input: AcquisitionTaxInput = {
      propertyType,
      acquisitionPrice: price,
      houseCount: isHousing ? houseCount : undefined,
      isRegulatedArea: isHousing ? isRegulatedArea : undefined,
      isFirstTimeBuyer: isHousing && houseCount === 1 ? isFirstTimeBuyer : undefined,
      area: isHousing ? (parseInt(area) || 84) : undefined,
    };

    return acquisitionTaxCalculator.calculate(input);
  }, [propertyType, acquisitionPrice, houseCount, isRegulatedArea, isFirstTimeBuyer, area, isHousing]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value);
  };

  const formatRate = (rate: number) => {
    return (rate * 100).toFixed(1);
  };

  const quickPrices = [300000000, 500000000, 700000000, 900000000, 1200000000];

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        부동산 취득세 계산기
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

        {/* 취득가액 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            취득가액
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={acquisitionPrice}
            onChange={(e) => setAcquisitionPrice(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right text-lg"
            placeholder="500,000,000"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {quickPrices.map((price) => (
              <button
                key={price}
                onClick={() => setAcquisitionPrice(price.toString())}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors"
              >
                {formatCurrency(price / 100000000)}억
              </button>
            ))}
          </div>
        </div>

        {/* 주택인 경우 추가 옵션 */}
        {isHousing && (
          <>
            {/* 주택 수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보유 주택 수 (이번 취득 포함)
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

            {/* 전용면적 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전용면적 (㎡)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={area}
                onChange={(e) => setArea(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right text-lg"
                placeholder="84"
              />
              <p className="text-xs text-gray-500 mt-1">
                85㎡ 초과 시 농어촌특별세 2% 추가
              </p>
            </div>

            {/* 조정대상지역 */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRegulatedArea}
                  onChange={(e) => setIsRegulatedArea(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-800">조정대상지역</span>
                  <p className="text-xs text-gray-500 mt-1">
                    다주택자 중과세율 적용 (2주택 8%, 3주택 이상 12%)
                  </p>
                </div>
              </label>
            </div>

            {/* 생애 최초 구매자 */}
            {houseCount === 1 && (
              <div className="bg-green-50 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFirstTimeBuyer}
                    onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">생애 최초 주택 구매</span>
                    <p className="text-xs text-gray-500 mt-1">
                      1.5억 이하 면제, 그 외 50% 감면 (수도권 4억, 비수도권 3억 이하)
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
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-sm opacity-90 mb-1">총 납부 세금</div>
            <div className="text-2xl font-bold">
              {formatCurrency(result.totalTax)}원
            </div>
            <div className="text-sm opacity-80 mt-1">
              취득세율 {formatRate(result.acquisitionTaxRate)}%
            </div>
          </div>

          {/* 세금 상세 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">세금 내역</span>
            </div>
            <div className="divide-y divide-gray-200">
              {result.breakdown.map((item, index) => (
                <div key={index} className="px-4 py-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-800">{item.label}</div>
                    <div className="text-xs text-gray-500">{formatRate(item.rate)}%</div>
                  </div>
                  <div className="text-right font-medium text-gray-800">
                    {formatCurrency(item.amount)}원
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>* 2024년 취득세 기준으로 계산됩니다.</p>
            <p>* 실제 세금은 지역, 감면 조건 등에 따라 달라질 수 있습니다.</p>
            <p>* 정확한 금액은 관할 세무서에 문의하세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}
