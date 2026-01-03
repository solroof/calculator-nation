"use client";

import { useState } from "react";

type Gender = "male" | "female";

interface Drink {
  name: string;
  amount: number; // ml
  percent: number; // 도수
  icon: string;
}

const drinks: Drink[] = [
  { name: "소주 (1잔)", amount: 50, percent: 17, icon: "🍶" },
  { name: "맥주 (500ml)", amount: 500, percent: 5, icon: "🍺" },
  { name: "소맥 (1잔)", amount: 200, percent: 8, icon: "🥃" },
  { name: "막걸리 (1잔)", amount: 200, percent: 6, icon: "🍶" },
  { name: "와인 (1잔)", amount: 150, percent: 13, icon: "🍷" },
  { name: "위스키 (1샷)", amount: 30, percent: 40, icon: "🥃" },
  { name: "하이볼 (1잔)", amount: 300, percent: 7, icon: "🍹" },
  { name: "소주 (1병)", amount: 360, percent: 17, icon: "🍾" },
  { name: "맥주 (1캔 355ml)", amount: 355, percent: 5, icon: "🍺" },
];

export function AlcoholCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [weight, setWeight] = useState("70");
  const [selectedDrinks, setSelectedDrinks] = useState<{ drink: Drink; count: number }[]>([]);

  const addDrink = (drink: Drink) => {
    const existing = selectedDrinks.find((d) => d.drink.name === drink.name);
    if (existing) {
      setSelectedDrinks(
        selectedDrinks.map((d) =>
          d.drink.name === drink.name ? { ...d, count: d.count + 1 } : d
        )
      );
    } else {
      setSelectedDrinks([...selectedDrinks, { drink, count: 1 }]);
    }
  };

  const removeDrink = (drinkName: string) => {
    setSelectedDrinks(selectedDrinks.filter((d) => d.drink.name !== drinkName));
  };

  const updateCount = (drinkName: string, delta: number) => {
    setSelectedDrinks(
      selectedDrinks
        .map((d) =>
          d.drink.name === drinkName
            ? { ...d, count: Math.max(0, d.count + delta) }
            : d
        )
        .filter((d) => d.count > 0)
    );
  };

  const calculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0 || selectedDrinks.length === 0) return null;

    // 총 알코올 섭취량 (g)
    const totalAlcohol = selectedDrinks.reduce((sum, { drink, count }) => {
      const alcoholGrams = (drink.amount * (drink.percent / 100) * 0.8 * count);
      return sum + alcoholGrams;
    }, 0);

    // Widmark 공식
    const r = gender === "male" ? 0.68 : 0.55; // 체내 수분 비율
    const bac = (totalAlcohol / (w * r * 10)); // 혈중 알코올 농도 (%)

    // 알코올 분해 속도: 시간당 0.015%
    const metabolismRate = 0.015;
    const hoursToSober = bac / metabolismRate;

    // 운전 가능 시간 (혈중 알코올 0.03% 이하)
    const hoursToDrive = Math.max(0, (bac - 0.03) / metabolismRate);

    // 음주 상태 판단
    let status: string;
    let statusColor: string;
    if (bac < 0.03) {
      status = "정상";
      statusColor = "text-green-500";
    } else if (bac < 0.05) {
      status = "면허정지 수준";
      statusColor = "text-yellow-500";
    } else if (bac < 0.08) {
      status = "면허취소 수준";
      statusColor = "text-orange-500";
    } else {
      status = "만취";
      statusColor = "text-red-500";
    }

    return {
      totalAlcohol: totalAlcohol.toFixed(1),
      bac: (bac * 100).toFixed(3), // 표시용 (%)
      hoursToSober: hoursToSober.toFixed(1),
      hoursToDrive: hoursToDrive.toFixed(1),
      status,
      statusColor,
    };
  };

  const result = calculate();

  return (
    <div id="alcohol" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">음주 분해시간 계산기</h2>
          <p className="text-xs text-gray-500">혈중 알코올 농도 추정</p>
        </div>
        <span className="text-2xl">🍺</span>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGender("male")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              gender === "male"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            남성
          </button>
          <button
            onClick={() => setGender("female")}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              gender === "female"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            여성
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">체중 (kg)</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">음주량 선택</p>
        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
          {drinks.map((drink) => (
            <button
              key={drink.name}
              onClick={() => addDrink(drink)}
              className="px-2 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
            >
              <span className="text-lg block text-center">{drink.icon}</span>
              <p className="text-xs text-gray-700 text-center truncate">{drink.name}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedDrinks.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">마신 술</p>
          <div className="space-y-2">
            {selectedDrinks.map(({ drink, count }) => (
              <div
                key={drink.name}
                className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg"
              >
                <span className="text-sm">{drink.icon} {drink.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCount(drink.name, -1)}
                    className="w-6 h-6 bg-gray-100 rounded"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-medium">{count}</span>
                  <button
                    onClick={() => updateCount(drink.name, 1)}
                    className="w-6 h-6 bg-gray-100 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeDrink(drink.name)}
                    className="text-red-400 ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">추정 혈중알코올농도</p>
              <p className="text-3xl font-bold">{result.bac}%</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white ${result.statusColor}`}>
              {result.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs">알코올 섭취량</p>
              <p className="font-bold">{result.totalAlcohol}g</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs">완전 분해까지</p>
              <p className="font-bold">{result.hoursToSober}시간</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 col-span-2">
              <p className="text-white/70 text-xs">운전 가능까지 (0.03% 이하)</p>
              <p className="font-bold">{result.hoursToDrive}시간</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-red-50 rounded-xl">
        <p className="text-sm font-medium text-red-700 mb-2">⚠️ 주의사항</p>
        <div className="text-xs text-red-600 space-y-1">
          <p>• 음주 후 운전은 절대 금지!</p>
          <p>• 개인차가 있어 참고용으로만 사용</p>
          <p>• 실제 농도는 더 높을 수 있음</p>
        </div>
      </div>
    </div>
  );
}
