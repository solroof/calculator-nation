"use client";

import { useState } from "react";

type ShapeType = "rectangle" | "square" | "parallelogram" | "trapezoid";

export function RectangleCalculator() {
  const [shapeType, setShapeType] = useState<ShapeType>("rectangle");
  const [width, setWidth] = useState("10");
  const [height, setHeight] = useState("5");
  const [topWidth, setTopWidth] = useState("6"); // 사다리꼴 윗변

  const calculate = () => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    const top = parseFloat(topWidth);

    if (isNaN(w) || w <= 0) return null;

    switch (shapeType) {
      case "square":
        return {
          area: w * w,
          perimeter: 4 * w,
          description: `한 변: ${w}`,
        };
      case "rectangle":
        if (isNaN(h) || h <= 0) return null;
        return {
          area: w * h,
          perimeter: 2 * (w + h),
          description: `가로: ${w}, 세로: ${h}`,
        };
      case "parallelogram":
        if (isNaN(h) || h <= 0) return null;
        return {
          area: w * h,
          perimeter: null, // 빗변 길이 필요
          description: `밑변: ${w}, 높이: ${h}`,
        };
      case "trapezoid":
        if (isNaN(h) || h <= 0 || isNaN(top) || top <= 0) return null;
        return {
          area: ((w + top) * h) / 2,
          perimeter: null, // 빗변 길이 필요
          description: `윗변: ${top}, 아랫변: ${w}, 높이: ${h}`,
        };
      default:
        return null;
    }
  };

  const result = calculate();

  const shapes = [
    { key: "rectangle", label: "직사각형", icon: "▭" },
    { key: "square", label: "정사각형", icon: "□" },
    { key: "parallelogram", label: "평행사변형", icon: "▱" },
    { key: "trapezoid", label: "사다리꼴", icon: "⏢" },
  ];

  return (
    <div id="rectangle" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">사각형 계산기</h2>
          <p className="text-xs text-gray-500">사각형의 넓이와 둘레 계산</p>
        </div>
        <span className="text-2xl">⬜</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">도형 선택</p>
        <div className="grid grid-cols-2 gap-2">
          {shapes.map((s) => (
            <button
              key={s.key}
              onClick={() => setShapeType(s.key as ShapeType)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                shapeType === s.key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {shapeType === "square" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">한 변의 길이</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
              placeholder="한 변의 길이"
              min="0"
            />
          </div>
        ) : (
          <>
            {shapeType === "trapezoid" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">윗변</label>
                <input
                  type="number"
                  value={topWidth}
                  onChange={(e) => setTopWidth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
                  placeholder="윗변"
                  min="0"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {shapeType === "trapezoid" ? "아랫변" : shapeType === "parallelogram" ? "밑변" : "가로"}
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {shapeType === "rectangle" ? "세로" : "높이"}
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
                  min="0"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-3">계산 결과</p>
          <div className="space-y-3">
            <div>
              <p className="text-white/70 text-xs">넓이</p>
              <p className="text-3xl font-bold">{result.area.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
            </div>
            {result.perimeter !== null && (
              <div>
                <p className="text-white/70 text-xs">둘레</p>
                <p className="text-xl font-bold">{result.perimeter.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
              </div>
            )}
            <p className="text-white/60 text-xs mt-2">{result.description}</p>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          {shapeType === "square" && (
            <>
              <p>넓이 = 변 × 변</p>
              <p>둘레 = 4 × 변</p>
            </>
          )}
          {shapeType === "rectangle" && (
            <>
              <p>넓이 = 가로 × 세로</p>
              <p>둘레 = 2 × (가로 + 세로)</p>
            </>
          )}
          {shapeType === "parallelogram" && <p>넓이 = 밑변 × 높이</p>}
          {shapeType === "trapezoid" && <p>넓이 = (윗변 + 아랫변) × 높이 ÷ 2</p>}
        </div>
      </div>
    </div>
  );
}
