"use client";

import { useState } from "react";
import { NumberInput } from "@/components/ui";

type CalcMode = "radius" | "diameter" | "volume" | "surfaceArea";

export function SphereCalculator() {
  const [mode, setMode] = useState<CalcMode>("radius");
  const [value, setValue] = useState<number>(5);

  const calculate = () => {
    let radius = 0;

    switch (mode) {
      case "radius":
        radius = value;
        break;
      case "diameter":
        radius = value / 2;
        break;
      case "volume":
        radius = Math.cbrt((3 * value) / (4 * Math.PI));
        break;
      case "surfaceArea":
        radius = Math.sqrt(value / (4 * Math.PI));
        break;
    }

    const diameter = radius * 2;
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const surfaceArea = 4 * Math.PI * Math.pow(radius, 2);

    return {
      radius,
      diameter,
      volume,
      surfaceArea,
    };
  };

  const result = calculate();

  const modes = [
    { key: "radius", label: "반지름", unit: "" },
    { key: "diameter", label: "지름", unit: "" },
    { key: "volume", label: "부피", unit: "³" },
    { key: "surfaceArea", label: "겉넓이", unit: "²" },
  ];

  return (
    <div id="sphere" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">구 계산기</h2>
          <p className="text-xs text-gray-500">부피, 겉넓이 계산</p>
        </div>
        <span className="text-2xl">🔮</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">계산 기준</label>
          <div className="grid grid-cols-2 gap-2">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key as CalcMode)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  mode === m.key
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium text-sm">{m.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {modes.find((m) => m.key === mode)?.label} 입력
          </label>
          <NumberInput
            value={value}
            onChange={setValue}
            min={0}
            step={1}
            format="comma"
          />
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">반지름</p>
            <p className="text-xl font-bold">{result.radius.toFixed(4)}</p>
          </div>
          <div className="text-center">
            <p className="text-white/70 text-xs mb-1">지름</p>
            <p className="text-xl font-bold">{result.diameter.toFixed(4)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between p-4 bg-purple-50 rounded-xl">
          <div>
            <p className="text-sm text-gray-600">부피 (V)</p>
            <p className="text-xs text-gray-400">V = (4/3)πr³</p>
          </div>
          <p className="text-lg font-bold text-purple-600">{result.volume.toFixed(4)}</p>
        </div>
        <div className="flex justify-between p-4 bg-indigo-50 rounded-xl">
          <div>
            <p className="text-sm text-gray-600">겉넓이 (S)</p>
            <p className="text-xs text-gray-400">S = 4πr²</p>
          </div>
          <p className="text-lg font-bold text-indigo-600">{result.surfaceArea.toFixed(4)}</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 부피: V = (4/3)πr³</p>
          <p>• 겉넓이: S = 4πr²</p>
          <p>• 지름: d = 2r</p>
          <p>• 부피에서 반지름: r = ∛(3V/4π)</p>
          <p>• 겉넓이에서 반지름: r = √(S/4π)</p>
        </div>
      </div>
    </div>
  );
}
