"use client";

import { useState } from "react";

export function TemperatureCalculator() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");
  const [kelvin, setKelvin] = useState("");

  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    const c = parseFloat(value);
    if (!isNaN(c)) {
      setFahrenheit(((c * 9) / 5 + 32).toFixed(2));
      setKelvin((c + 273.15).toFixed(2));
    } else {
      setFahrenheit("");
      setKelvin("");
    }
  };

  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    const f = parseFloat(value);
    if (!isNaN(f)) {
      setCelsius((((f - 32) * 5) / 9).toFixed(2));
      setKelvin((((f - 32) * 5) / 9 + 273.15).toFixed(2));
    } else {
      setCelsius("");
      setKelvin("");
    }
  };

  const handleKelvinChange = (value: string) => {
    setKelvin(value);
    const k = parseFloat(value);
    if (!isNaN(k)) {
      setCelsius((k - 273.15).toFixed(2));
      setFahrenheit((((k - 273.15) * 9) / 5 + 32).toFixed(2));
    } else {
      setCelsius("");
      setFahrenheit("");
    }
  };

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
              onClick={() => handleCelsiusChange(temp.c.toString())}
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
              onChange={(e) => handleCelsiusChange(e.target.value)}
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
              onChange={(e) => handleFahrenheitChange(e.target.value)}
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
              onChange={(e) => handleKelvinChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="298.15"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">K</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• °F = °C × 9/5 + 32</p>
          <p>• °C = (°F - 32) × 5/9</p>
          <p>• K = °C + 273.15</p>
          <p>• °C = K - 273.15</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">주요 기준점</p>
          <p>• 절대영도: 0K = -273.15°C = -459.67°F</p>
          <p>• 물 어는점: 0°C = 32°F = 273.15K</p>
          <p>• 물 끓는점: 100°C = 212°F = 373.15K</p>
        </div>
      </div>
    </div>
  );
}
