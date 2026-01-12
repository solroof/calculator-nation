"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

export function CylinderCalculator() {
  const [radius, setRadius] = useState<number>(5);
  const [height, setHeight] = useState<number>(10);

  const r = radius || 0;
  const h = height || 0;

  const baseArea = Math.PI * r * r;
  const lateralArea = 2 * Math.PI * r * h;
  const surfaceArea = 2 * baseArea + lateralArea;
  const volume = baseArea * h;
  const diameter = r * 2;

  return (
    <div id="cylinder" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">원기둥 계산기</h2>
          <p className="text-xs text-gray-500">부피, 겉넓이 계산</p>
        </div>
        <span className="text-2xl">🥫</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">반지름 (r)</label>
            <NumberInput
              value={radius}
              onChange={setRadius}
              min={0}
              step={1}
              format="comma"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">높이 (h)</label>
            <NumberInput
              value={height}
              onChange={setHeight}
              min={0}
              step={1}
              format="comma"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">부피 (V)</p>
            <p className="text-2xl font-bold">{volume.toFixed(2)}</p>
            <p className="text-white/50 text-xs">πr²h</p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">겉넓이 (S)</p>
            <p className="text-2xl font-bold">{surfaceArea.toFixed(2)}</p>
            <p className="text-white/50 text-xs">2πr² + 2πrh</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-gray-600">지름</span>
          <span className="font-medium">{diameter.toFixed(4)}</span>
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

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 부피 (V) = πr²h</p>
          <p>• 겉넓이 (S) = 2πr² + 2πrh = 2πr(r + h)</p>
          <p>• 밑면 넓이 = πr²</p>
          <p>• 옆면 넓이 = 2πrh</p>
          <p>• 밑면 둘레 = 2πr</p>
        </div>
      </div>
    </div>
  );
}
