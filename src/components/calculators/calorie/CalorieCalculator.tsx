"use client";

import { useState } from "react";

const foods = [
  { name: "밥 (1공기, 210g)", calories: 313, icon: "🍚" },
  { name: "라면 (1봉지)", calories: 500, icon: "🍜" },
  { name: "김치찌개", calories: 180, icon: "🥘" },
  { name: "삼겹살 (100g)", calories: 330, icon: "🥩" },
  { name: "치킨 (1조각)", calories: 200, icon: "🍗" },
  { name: "피자 (1조각)", calories: 270, icon: "🍕" },
  { name: "햄버거", calories: 500, icon: "🍔" },
  { name: "떡볶이 (1인분)", calories: 380, icon: "🍢" },
  { name: "김밥 (1줄)", calories: 400, icon: "🍙" },
  { name: "불고기 (100g)", calories: 220, icon: "🥓" },
  { name: "계란 (1개)", calories: 75, icon: "🥚" },
  { name: "두부 (100g)", calories: 80, icon: "🧈" },
  { name: "사과 (1개)", calories: 95, icon: "🍎" },
  { name: "바나나 (1개)", calories: 105, icon: "🍌" },
  { name: "우유 (200ml)", calories: 125, icon: "🥛" },
  { name: "콜라 (350ml)", calories: 140, icon: "🥤" },
  { name: "아메리카노", calories: 5, icon: "☕" },
  { name: "카페라떼", calories: 180, icon: "☕" },
];

const exercises = [
  { name: "걷기 (30분)", caloriesPerHour: 200 },
  { name: "달리기 (30분)", caloriesPerHour: 600 },
  { name: "수영 (30분)", caloriesPerHour: 400 },
  { name: "자전거 (30분)", caloriesPerHour: 300 },
];

export function CalorieCalculator() {
  const [selectedFoods, setSelectedFoods] = useState<{ name: string; calories: number; count: number }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customFood, setCustomFood] = useState("");
  const [customCalories, setCustomCalories] = useState("");

  const totalCalories = selectedFoods.reduce((sum, f) => sum + f.calories * f.count, 0);

  const addFood = (food: { name: string; calories: number }) => {
    const existing = selectedFoods.find((f) => f.name === food.name);
    if (existing) {
      setSelectedFoods(
        selectedFoods.map((f) =>
          f.name === food.name ? { ...f, count: f.count + 1 } : f
        )
      );
    } else {
      setSelectedFoods([...selectedFoods, { ...food, count: 1 }]);
    }
  };

  const removeFood = (name: string) => {
    setSelectedFoods(selectedFoods.filter((f) => f.name !== name));
  };

  const updateCount = (name: string, delta: number) => {
    setSelectedFoods(
      selectedFoods
        .map((f) =>
          f.name === name ? { ...f, count: Math.max(0, f.count + delta) } : f
        )
        .filter((f) => f.count > 0)
    );
  };

  const addCustomFood = () => {
    if (customFood && customCalories) {
      addFood({ name: customFood, calories: parseInt(customCalories) });
      setCustomFood("");
      setCustomCalories("");
    }
  };

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="calorie" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">칼로리 계산기</h2>
          <p className="text-xs text-gray-500">음식별 칼로리 계산</p>
        </div>
        <span className="text-2xl">🍎</span>
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500"
          placeholder="음식 검색..."
        />
      </div>

      {/* 음식 목록 */}
      <div className="mb-4 max-h-48 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {filteredFoods.map((food) => (
            <button
              key={food.name}
              onClick={() => addFood(food)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <span>{food.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{food.name}</p>
                <p className="text-xs text-gray-400">{food.calories}kcal</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 직접 입력 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-600 mb-2">직접 입력</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customFood}
            onChange={(e) => setCustomFood(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="음식명"
          />
          <input
            type="number"
            value={customCalories}
            onChange={(e) => setCustomCalories(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            placeholder="kcal"
          />
          <button
            onClick={addCustomFood}
            className="px-3 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium"
          >
            추가
          </button>
        </div>
      </div>

      {/* 선택된 음식 */}
      {selectedFoods.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">선택한 음식</p>
          <div className="space-y-2">
            {selectedFoods.map((food) => (
              <div
                key={food.name}
                className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg"
              >
                <span className="text-sm text-gray-700 truncate flex-1">{food.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCount(food.name, -1)}
                    className="w-6 h-6 bg-gray-100 rounded text-gray-600"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{food.count}</span>
                  <button
                    onClick={() => updateCount(food.name, 1)}
                    className="w-6 h-6 bg-gray-100 rounded text-gray-600"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 w-16 text-right">
                    {(food.calories * food.count).toLocaleString()}kcal
                  </span>
                  <button
                    onClick={() => removeFood(food.name)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 총 칼로리 */}
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white">
        <p className="text-white/80 text-sm mb-1">총 섭취 칼로리</p>
        <p className="text-3xl font-bold">
          {totalCalories.toLocaleString()}
          <span className="text-lg ml-1 font-normal opacity-80">kcal</span>
        </p>
        {totalCalories > 0 && (
          <div className="mt-3 text-sm text-white/70">
            <p>소모하려면:</p>
            {exercises.map((ex) => (
              <p key={ex.name}>
                • {ex.name}: 약 {Math.round((totalCalories / ex.caloriesPerHour) * 30)}분
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">하루 권장 칼로리</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 성인 남성: 2,000~2,500 kcal</p>
          <p>• 성인 여성: 1,600~2,000 kcal</p>
        </div>
      </div>
    </div>
  );
}
