"use client";

import { useState, useEffect } from "react";

type TempUnit = "celsius" | "fahrenheit" | "kelvin";

export function TemperatureCalculator() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");
  const [kelvin, setKelvin] = useState("");
  const [lastEdited, setLastEdited] = useState<TempUnit>("celsius");

  useEffect(() => {
    const c = parseFloat(celsius);
    const f = parseFloat(fahrenheit);
    const k = parseFloat(kelvin);

    if (lastEdited === "celsius" && !isNaN(c)) {
      setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
      setKelvin((c + 273.15).toFixed(2));
    } else if (lastEdited === "fahrenheit" && !isNaN(f)) {
      setCelsius((((f - 32) * 5) / 9).toFixed(2));
      setKelvin((((f - 32) * 5) / 9 + 273.15).toFixed(2));
    } else if (lastEdited === "kelvin" && !isNaN(k)) {
      setCelsius((k - 273.15).toFixed(2));
      setFahrenheit((((k - 273.15) * 9) / 5 + 32).toFixed(2));
    }
  }, [celsius, fahrenheit, kelvin, lastEdited]);

  const quickTemps = [
    { label: "물 어는점", c: 0 },
    { label: "실온", c: 20 },
    { label: "체온", c: 36.5 },
    { label: "물 끓는점", c: 100 },
  ];

  return (
    <div id="temperature" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">온도 변환</h2>
          <p className="text-xs text-gray-500">섭씨 ↔ 화씨 ↔ 켈빈</p>
        </div>
        <span className="text-2xl">🌡️</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">빠른 선택</p>
        <div className="flex flex-wrap gap-2">
          {quickTemps.map((temp) => (
            <button
              key={temp.label}
              onClick={() => {
                setCelsius(temp.c.toString());
                setLastEdited("celsius");
              }}
              className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-cyan-100 hover:text-cyan-700 transition-all"
            >
              {temp.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">섭씨 (°C)</label>
          <div className="relative">
            <input
              type="number"
              value={celsius}
              onChange={(e) => {
                setCelsius(e.target.value);
                setLastEdited("celsius");
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="25"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">°C</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">화씨 (°F)</label>
          <div className="relative">
            <input
              type="number"
              value={fahrenheit}
              onChange={(e) => {
                setFahrenheit(e.target.value);
                setLastEdited("fahrenheit");
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="77"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">°F</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">켈빈 (K)</label>
          <div className="relative">
            <input
              type="number"
              value={kelvin}
              onChange={(e) => {
                setKelvin(e.target.value);
                setLastEdited("kelvin");
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="298.15"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">K</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 space-y-1">
        <p>• °F = °C × 9/5 + 32</p>
        <p>• K = °C + 273.15</p>
      </div>
    </div>
  );
}
