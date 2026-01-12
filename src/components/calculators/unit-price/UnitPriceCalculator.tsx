"use client";

import { useState } from "react";

interface Item {
  id: string;
  name: string;
  price: string;
  amount: string;
  unit: string;
}

export function UnitPriceCalculator() {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "상품 A", price: "5000", amount: "500", unit: "g" },
    { id: "2", name: "상품 B", price: "8000", amount: "1000", unit: "g" },
  ]);
  const [standardUnit, setStandardUnit] = useState("100");

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: `상품 ${items.length + 1}`, price: "", amount: "", unit: "g" },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof Item, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculateUnitPrice = (price: string, amount: string) => {
    const p = parseFloat(price);
    const a = parseFloat(amount);
    const std = parseFloat(standardUnit);
    if (isNaN(p) || isNaN(a) || isNaN(std) || a === 0) return null;
    return (p / a) * std;
  };

  const getResults = () => {
    return items
      .map((item) => ({
        ...item,
        unitPrice: calculateUnitPrice(item.price, item.amount),
      }))
      .filter((item) => item.unitPrice !== null)
      .sort((a, b) => (a.unitPrice || 0) - (b.unitPrice || 0));
  };

  const results = getResults();
  const cheapest = results[0];

  return (
    <div id="unit-price" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">단가 비교 계산기</h2>
          <p className="text-xs text-gray-500">어느 게 더 저렴한지 비교</p>
        </div>
        <span className="text-2xl">🛒</span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          기준 단위 (비교할 단위량)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={standardUnit}
            onChange={(e) => setStandardUnit(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500"
            min="1"
          />
          <span className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600">
            {items[0]?.unit || "단위"}당 가격
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                className="font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-violet-500 focus:outline-none"
                placeholder="상품명"
              />
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  삭제
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">가격 (원)</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">용량</label>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => updateItem(item.id, "amount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">단위</label>
                <select
                  value={item.unit}
                  onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="L">L</option>
                  <option value="개">개</option>
                  <option value="장">장</option>
                  <option value="매">매</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-violet-400 hover:text-violet-500 transition-colors mb-4"
      >
        + 상품 추가
      </button>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((item, idx) => (
            <div
              key={item.id}
              className={`rounded-xl p-4 ${
                idx === 0
                  ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className={`font-medium ${idx === 0 ? "text-white" : "text-gray-800"}`}>
                    {idx === 0 && "🏆 "}
                    {item.name}
                  </p>
                  <p className={`text-sm ${idx === 0 ? "text-white/70" : "text-gray-500"}`}>
                    {item.price}원 / {item.amount}{item.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${idx === 0 ? "text-white" : "text-gray-800"}`}>
                    {Math.round(item.unitPrice || 0).toLocaleString()}원
                  </p>
                  <p className={`text-xs ${idx === 0 ? "text-white/70" : "text-gray-500"}`}>
                    {standardUnit}{item.unit}당
                  </p>
                </div>
              </div>
              {idx > 0 && cheapest && (
                <p className="text-xs text-gray-400 mt-1">
                  1위보다 {Math.round(((item.unitPrice || 0) - (cheapest.unitPrice || 0)) / (cheapest.unitPrice || 1) * 100)}% 비쌈
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 단가 = (가격 ÷ 용량) × 기준단위</p>
          <p>• 비교 = (단가A - 단가B) ÷ 단가B × 100%</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">예시</p>
          <p>• 5,000원/500g → 100g당 1,000원</p>
          <p>• 8,000원/1kg → 100g당 800원 (더 저렴)</p>
        </div>
      </div>
    </div>
  );
}
