"use client";

import { useState } from "react";

const commonRatios = [
  { name: "1:1", width: 1, height: 1, desc: "정사각형, 인스타그램" },
  { name: "4:3", width: 4, height: 3, desc: "구형 TV, iPad" },
  { name: "3:2", width: 3, height: 2, desc: "DSLR 사진" },
  { name: "16:9", width: 16, height: 9, desc: "HD TV, YouTube" },
  { name: "16:10", width: 16, height: 10, desc: "맥북, 와이드 모니터" },
  { name: "21:9", width: 21, height: 9, desc: "울트라와이드" },
  { name: "9:16", width: 9, height: 16, desc: "세로 영상, 릴스" },
  { name: "2:3", width: 2, height: 3, desc: "세로 사진" },
];

export function AspectRatioCalculator() {
  const [mode, setMode] = useState<"calculate" | "resize">("calculate");
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [targetWidth, setTargetWidth] = useState("1280");
  const [targetHeight, setTargetHeight] = useState("");
  const [lockAxis, setLockAxis] = useState<"width" | "height">("width");

  // 최대공약수
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  // 비율 계산
  const calculateRatio = () => {
    const w = parseInt(width) || 0;
    const h = parseInt(height) || 0;
    if (w === 0 || h === 0) return { ratio: "0:0", decimal: 0, simplified: "0:0" };

    const g = gcd(w, h);
    const ratioW = w / g;
    const ratioH = h / g;
    const decimal = w / h;

    return {
      ratio: `${w}:${h}`,
      decimal: decimal.toFixed(4),
      simplified: `${ratioW}:${ratioH}`,
    };
  };

  // 크기 재조정
  const calculateResize = () => {
    const w = parseInt(width) || 0;
    const h = parseInt(height) || 0;
    const tw = parseInt(targetWidth) || 0;
    const th = parseInt(targetHeight) || 0;

    if (w === 0 || h === 0) return { newWidth: 0, newHeight: 0 };

    const ratio = w / h;

    if (lockAxis === "width" && tw > 0) {
      return { newWidth: tw, newHeight: Math.round(tw / ratio) };
    } else if (lockAxis === "height" && th > 0) {
      return { newWidth: Math.round(th * ratio), newHeight: th };
    }

    return { newWidth: 0, newHeight: 0 };
  };

  const ratio = calculateRatio();
  const resize = calculateResize();

  // 일반 비율 매칭
  const matchedRatio = commonRatios.find((r) => {
    const w = parseInt(width) || 0;
    const h = parseInt(height) || 0;
    const g = gcd(w, h);
    return w / g === r.width && h / g === r.height;
  });

  return (
    <div id="aspect-ratio" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">사진 비율 계산기</h2>
          <p className="text-xs text-gray-500">화면비, 이미지 크기 계산</p>
        </div>
        <span className="text-2xl">🖼️</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMode("calculate")}
            className={`p-2 rounded-xl border-2 text-sm transition-all ${
              mode === "calculate"
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "border-gray-200"
            }`}
          >
            비율 계산
          </button>
          <button
            onClick={() => setMode("resize")}
            className={`p-2 rounded-xl border-2 text-sm transition-all ${
              mode === "resize"
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "border-gray-200"
            }`}
          >
            크기 조정
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가로 (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">세로 (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-center"
            />
          </div>
        </div>

        {mode === "calculate" && (
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white">
            <div className="text-center">
              <p className="text-white/70 text-sm mb-1">화면비</p>
              <p className="text-3xl font-bold">{ratio.simplified}</p>
              {matchedRatio && (
                <p className="text-white/70 text-sm mt-2">{matchedRatio.desc}</p>
              )}
              <p className="text-white/50 text-xs mt-2">비율값: {ratio.decimal}</p>
            </div>
          </div>
        )}

        {mode === "resize" && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLockAxis("width")}
                className={`p-2 rounded-xl border-2 text-sm ${
                  lockAxis === "width"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                가로 기준
              </button>
              <button
                onClick={() => setLockAxis("height")}
                className={`p-2 rounded-xl border-2 text-sm ${
                  lockAxis === "height"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                세로 기준
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lockAxis === "width" ? "새 가로 크기 (px)" : "새 세로 크기 (px)"}
              </label>
              <input
                type="number"
                value={lockAxis === "width" ? targetWidth : targetHeight}
                onChange={(e) =>
                  lockAxis === "width"
                    ? setTargetWidth(e.target.value)
                    : setTargetHeight(e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white text-center">
              <p className="text-white/70 text-sm mb-1">조정된 크기</p>
              <p className="text-2xl font-bold">
                {resize.newWidth} × {resize.newHeight}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 p-3 bg-indigo-50 rounded-xl">
        <p className="text-sm font-medium text-indigo-800 mb-2">일반적인 화면비</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {commonRatios.slice(0, 6).map((r) => (
            <button
              key={r.name}
              onClick={() => {
                setWidth(String(r.width * 100));
                setHeight(String(r.height * 100));
              }}
              className="p-2 bg-white rounded-lg text-left hover:bg-indigo-100 transition-colors"
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-gray-500 ml-1">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
