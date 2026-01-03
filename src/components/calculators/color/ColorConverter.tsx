"use client";

import { useState, useEffect } from "react";

type ColorMode = "hex" | "rgb" | "hsl";

export function ColorConverter() {
  const [hex, setHex] = useState("3B82F6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [activeMode, setActiveMode] = useState<ColorMode>("hex");

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, x)).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  const updateFromHex = (value: string) => {
    const clean = value.replace(/[^0-9A-Fa-f]/g, "").toUpperCase();
    setHex(clean);
    if (clean.length === 6) {
      const newRgb = hexToRgb(clean);
      if (newRgb) {
        setRgb(newRgb);
        setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
      }
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const newRgb = hslToRgb(h, s, l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div id="color" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">색상 변환기</h2>
          <p className="text-xs text-gray-500">HEX, RGB, HSL 변환</p>
        </div>
        <span className="text-2xl">🎨</span>
      </div>

      {/* 색상 미리보기 */}
      <div
        className="h-24 rounded-2xl mb-4 shadow-inner"
        style={{ backgroundColor: `#${hex.padEnd(6, "0")}` }}
      />

      {/* HEX 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">HEX</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">#</span>
            <input
              type="text"
              value={hex}
              onChange={(e) => {
                setActiveMode("hex");
                updateFromHex(e.target.value);
              }}
              maxLength={6}
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
              placeholder="3B82F6"
            />
          </div>
          <button
            onClick={() => copyToClipboard(`#${hex}`)}
            className="px-4 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200"
          >
            복사
          </button>
        </div>
      </div>

      {/* RGB 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">RGB</label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <input
              type="number"
              value={rgb.r}
              onChange={(e) => {
                setActiveMode("rgb");
                updateFromRgb(parseInt(e.target.value) || 0, rgb.g, rgb.b);
              }}
              min="0"
              max="255"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center"
              placeholder="R"
            />
            <p className="text-xs text-gray-400 text-center mt-1">R</p>
          </div>
          <div>
            <input
              type="number"
              value={rgb.g}
              onChange={(e) => {
                setActiveMode("rgb");
                updateFromRgb(rgb.r, parseInt(e.target.value) || 0, rgb.b);
              }}
              min="0"
              max="255"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center"
              placeholder="G"
            />
            <p className="text-xs text-gray-400 text-center mt-1">G</p>
          </div>
          <div>
            <input
              type="number"
              value={rgb.b}
              onChange={(e) => {
                setActiveMode("rgb");
                updateFromRgb(rgb.r, rgb.g, parseInt(e.target.value) || 0);
              }}
              min="0"
              max="255"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center"
              placeholder="B"
            />
            <p className="text-xs text-gray-400 text-center mt-1">B</p>
          </div>
        </div>
        <button
          onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
          className="w-full mt-2 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200"
        >
          rgb({rgb.r}, {rgb.g}, {rgb.b}) 복사
        </button>
      </div>

      {/* HSL 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">HSL</label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <input
              type="number"
              value={hsl.h}
              onChange={(e) => {
                setActiveMode("hsl");
                updateFromHsl(parseInt(e.target.value) || 0, hsl.s, hsl.l);
              }}
              min="0"
              max="360"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center"
              placeholder="H"
            />
            <p className="text-xs text-gray-400 text-center mt-1">H (0-360)</p>
          </div>
          <div>
            <input
              type="number"
              value={hsl.s}
              onChange={(e) => {
                setActiveMode("hsl");
                updateFromHsl(hsl.h, parseInt(e.target.value) || 0, hsl.l);
              }}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center"
              placeholder="S"
            />
            <p className="text-xs text-gray-400 text-center mt-1">S (%)</p>
          </div>
          <div>
            <input
              type="number"
              value={hsl.l}
              onChange={(e) => {
                setActiveMode("hsl");
                updateFromHsl(hsl.h, hsl.s, parseInt(e.target.value) || 0);
              }}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-center"
              placeholder="L"
            />
            <p className="text-xs text-gray-400 text-center mt-1">L (%)</p>
          </div>
        </div>
        <button
          onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
          className="w-full mt-2 py-2 bg-gray-100 rounded-xl text-sm hover:bg-gray-200"
        >
          hsl({hsl.h}, {hsl.s}%, {hsl.l}%) 복사
        </button>
      </div>
    </div>
  );
}
