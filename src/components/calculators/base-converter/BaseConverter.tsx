"use client";

import { useState } from "react";

type Base = "2" | "8" | "10" | "16";

const getInitialValues = (decimal: string) => {
  const num = parseInt(decimal, 10);
  if (isNaN(num) || num < 0) {
    return { binary: "", octal: "", hex: "" };
  }
  return {
    binary: num.toString(2),
    octal: num.toString(8),
    hex: num.toString(16).toUpperCase(),
  };
};

export function BaseConverter() {
  const [decimal, setDecimal] = useState("255");
  const initialValues = getInitialValues("255");
  const [binary, setBinary] = useState(initialValues.binary);
  const [octal, setOctal] = useState(initialValues.octal);
  const [hex, setHex] = useState(initialValues.hex);
  const [activeInput, setActiveInput] = useState<Base>("10");

  const updateFromDecimal = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) {
      setBinary("");
      setOctal("");
      setHex("");
      return;
    }
    setBinary(num.toString(2));
    setOctal(num.toString(8));
    setHex(num.toString(16).toUpperCase());
  };

  const updateFromBinary = (value: string) => {
    const clean = value.replace(/[^01]/g, "");
    const num = parseInt(clean, 2);
    if (isNaN(num)) {
      setDecimal("");
      setOctal("");
      setHex("");
      return;
    }
    setDecimal(num.toString(10));
    setOctal(num.toString(8));
    setHex(num.toString(16).toUpperCase());
  };

  const updateFromOctal = (value: string) => {
    const clean = value.replace(/[^0-7]/g, "");
    const num = parseInt(clean, 8);
    if (isNaN(num)) {
      setDecimal("");
      setBinary("");
      setHex("");
      return;
    }
    setDecimal(num.toString(10));
    setBinary(num.toString(2));
    setHex(num.toString(16).toUpperCase());
  };

  const updateFromHex = (value: string) => {
    const clean = value.replace(/[^0-9A-Fa-f]/g, "").toUpperCase();
    const num = parseInt(clean, 16);
    if (isNaN(num)) {
      setDecimal("");
      setBinary("");
      setOctal("");
      return;
    }
    setDecimal(num.toString(10));
    setBinary(num.toString(2));
    setOctal(num.toString(8));
  };

  const handleChange = (base: Base, value: string) => {
    setActiveInput(base);
    switch (base) {
      case "10":
        setDecimal(value);
        updateFromDecimal(value);
        break;
      case "2":
        setBinary(value);
        updateFromBinary(value);
        break;
      case "8":
        setOctal(value);
        updateFromOctal(value);
        break;
      case "16":
        setHex(value);
        updateFromHex(value);
        break;
    }
  };

  const bases: { key: Base; label: string; prefix: string; value: string }[] = [
    { key: "2", label: "2진수", prefix: "0b", value: binary },
    { key: "8", label: "8진수", prefix: "0o", value: octal },
    { key: "10", label: "10진수", prefix: "", value: decimal },
    { key: "16", label: "16진수", prefix: "0x", value: hex },
  ];

  return (
    <div id="base-converter" className="scroll-mt-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">진법 변환기</h2>
          <p className="text-xs text-gray-500">2진수, 8진수, 10진수, 16진수</p>
        </div>
        <span className="text-2xl">🔢</span>
      </div>

      <div className="space-y-4">
        {bases.map((base) => (
          <div key={base.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {base.label} ({base.key}진법)
            </label>
            <div className="relative">
              {base.prefix && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">
                  {base.prefix}
                </span>
              )}
              <input
                type="text"
                value={base.value}
                onChange={(e) => handleChange(base.key, e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl font-mono text-lg transition-all ${
                  activeInput === base.key
                    ? "border-indigo-500 ring-2 ring-indigo-200"
                    : "border-gray-200"
                } ${base.prefix ? "pl-10" : ""}`}
                placeholder={`${base.label} 입력`}
              />
            </div>
          </div>
        ))}
      </div>

      {decimal && !isNaN(parseInt(decimal)) && (
        <div className="mt-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-2">비트 표현</p>
          <div className="font-mono text-sm bg-white/10 p-3 rounded-lg break-all">
            {binary.padStart(Math.ceil(binary.length / 8) * 8, "0").match(/.{1,8}/g)?.join(" ")}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/70 text-xs">비트 수</p>
              <p className="font-medium">{binary.length} bits</p>
            </div>
            <div>
              <p className="text-white/70 text-xs">바이트 수</p>
              <p className="font-medium">{Math.ceil(binary.length / 8)} bytes</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">진법 설명</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 2진수: 컴퓨터 기본 단위 (0, 1)</p>
          <p>• 8진수: 3비트 그룹 (0-7)</p>
          <p>• 10진수: 일상 사용 (0-9)</p>
          <p>• 16진수: 색상코드, 메모리 주소 (0-F)</p>
        </div>
      </div>
    </div>
  );
}
