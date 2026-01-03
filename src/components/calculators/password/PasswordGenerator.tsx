"use client";

import { useState, useCallback } from "react";

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = "";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const ambiguous = "0O1lI";

    if (includeUpper) chars += upper;
    if (includeLower) chars += lower;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (excludeAmbiguous) {
      chars = chars.split("").filter((c) => !ambiguous.includes(c)).join("");
    }

    if (chars.length === 0) {
      setPassword("최소 하나의 옵션을 선택하세요");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);
    setCopied(false);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  const copyToClipboard = async () => {
    if (password && password !== "최소 하나의 옵션을 선택하세요") {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrength = () => {
    if (!password || password === "최소 하나의 옵션을 선택하세요") return null;

    let score = 0;
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;

    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 2;

    if (score <= 2) return { label: "약함", color: "bg-red-500", width: "25%" };
    if (score <= 4) return { label: "보통", color: "bg-yellow-500", width: "50%" };
    if (score <= 6) return { label: "강함", color: "bg-green-500", width: "75%" };
    return { label: "매우 강함", color: "bg-emerald-500", width: "100%" };
  };

  const strength = getStrength();

  return (
    <div id="password" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">비밀번호 생성기</h2>
          <p className="text-xs text-gray-500">안전한 랜덤 비밀번호</p>
        </div>
        <span className="text-2xl">🔐</span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          길이: {length}자
        </label>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>4</span>
          <span>64</span>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeUpper}
            onChange={(e) => setIncludeUpper(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-gray-700"
          />
          <span className="text-sm text-gray-700">대문자 (A-Z)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeLower}
            onChange={(e) => setIncludeLower(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-gray-700"
          />
          <span className="text-sm text-gray-700">소문자 (a-z)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-gray-700"
          />
          <span className="text-sm text-gray-700">숫자 (0-9)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-gray-700"
          />
          <span className="text-sm text-gray-700">특수문자 (!@#$%...)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={excludeAmbiguous}
            onChange={(e) => setExcludeAmbiguous(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-gray-700"
          />
          <span className="text-sm text-gray-700">혼동 문자 제외 (0, O, 1, l, I)</span>
        </label>
      </div>

      <button
        onClick={generate}
        className="w-full py-3.5 rounded-xl font-medium bg-gradient-to-r from-gray-600 to-gray-700 text-white active:from-gray-700 active:to-gray-800 shadow-sm transition-all mb-4"
      >
        🔐 비밀번호 생성
      </button>

      {password && (
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl p-5 text-white">
          <div className="flex justify-between items-start mb-3">
            <p className="text-white/80 text-sm">생성된 비밀번호</p>
            <button
              onClick={copyToClipboard}
              className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
            >
              {copied ? "✓ 복사됨" : "복사"}
            </button>
          </div>
          <p className="text-lg font-mono break-all bg-white/10 p-3 rounded-lg">
            {password}
          </p>
          {strength && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/70">강도</span>
                <span>{strength.label}</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all`}
                  style={{ width: strength.width }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
