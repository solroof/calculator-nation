"use client";

import { useState } from "react";

export function Base64Converter() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello, World!");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    try {
      if (mode === "encode") {
        // UTF-8 인코딩 후 Base64
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        // Base64 디코딩 후 UTF-8
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
    } catch {
      setError(mode === "decode" ? "올바른 Base64 형식이 아닙니다" : "인코딩 오류");
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const swapMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError("");
  };

  return (
    <div id="base64" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Base64 인코딩</h2>
          <p className="text-xs text-gray-500">텍스트 인코딩/디코딩</p>
        </div>
        <span className="text-2xl">🔐</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
            className={`p-3 rounded-xl border-2 transition-all ${
              mode === "encode"
                ? "border-purple-500 bg-purple-50 text-purple-600"
                : "border-gray-200"
            }`}
          >
            <p className="font-medium">인코딩</p>
            <p className="text-xs text-gray-500">텍스트 → Base64</p>
          </button>
          <button
            onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
            className={`p-3 rounded-xl border-2 transition-all ${
              mode === "decode"
                ? "border-purple-500 bg-purple-50 text-purple-600"
                : "border-gray-200"
            }`}
          >
            <p className="font-medium">디코딩</p>
            <p className="text-xs text-gray-500">Base64 → 텍스트</p>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mode === "encode" ? "원본 텍스트" : "Base64 문자열"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            rows={4}
            placeholder={mode === "encode" ? "변환할 텍스트 입력..." : "Base64 문자열 입력..."}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={convert}
            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            {mode === "encode" ? "인코딩" : "디코딩"}
          </button>
          <button
            onClick={swapMode}
            className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            title="입출력 교환"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">
                {mode === "encode" ? "Base64 결과" : "디코딩된 텍스트"}
              </label>
              <button
                onClick={copyToClipboard}
                className="text-xs text-purple-600 hover:text-purple-700"
              >
                복사
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl font-mono text-sm break-all">
              {output}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-purple-50 rounded-xl">
        <p className="text-sm font-medium text-purple-800 mb-1">Base64란?</p>
        <p className="text-xs text-gray-600">
          바이너리 데이터를 텍스트로 변환하는 인코딩 방식입니다.
          이메일, URL, 데이터 전송에 주로 사용됩니다.
        </p>
      </div>
    </div>
  );
}
