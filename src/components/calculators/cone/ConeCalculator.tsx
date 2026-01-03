"use client";

import { useState } from "react";

export function ConeCalculator() {
  const [radius, setRadius] = useState("5");
  const [height, setHeight] = useState("10");

  const r = parseFloat(radius) || 0;
  const h = parseFloat(height) || 0;

  const slantHeight = Math.sqrt(r * r + h * h);
  const baseArea = Math.PI * r * r;
  const lateralArea = Math.PI * r * slantHeight;
  const surfaceArea = baseArea + lateralArea;
  const volume = (1 / 3) * baseArea * h;
  const diameter = r * 2;

  return (
    <div id="cone" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">원뿔 계산기</h2>
          <p className="text-xs text-gray-500">부피, 겉넓이 계산</p>
        </div>
        <span className="text-2xl">🍦</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">밑면 반지름 (r)</label>
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 text-lg"
              placeholder="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">높이 (h)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 text-lg"
              placeholder="10"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-5 text-white">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">부피 (V)</p>
            <p className="text-2xl font-bold">{volume.toFixed(2)}</p>
            <p className="text-white/50 text-xs">(1/3)πr²h</p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">겉넓이 (S)</p>
            <p className="text-2xl font-bold">{surfaceArea.toFixed(2)}</p>
            <p className="text-white/50 text-xs">πr² + πrl</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">지름</span>
          <span className="font-medium">{diameter.toFixed(4)}</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">모선 길이 (l)</span>
          <span className="font-medium">{slantHeight.toFixed(4)}</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">밑면 넓이</span>
          <span className="font-medium">{baseArea.toFixed(4)}</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">옆면 넓이</span>
          <span className="font-medium">{lateralArea.toFixed(4)}</span>
        </div>
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">밑면 둘레</span>
          <span className="font-medium">{(2 * Math.PI * r).toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}
