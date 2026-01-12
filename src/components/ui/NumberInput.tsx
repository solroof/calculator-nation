/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useCallback, useEffect } from "react";

interface NumberInputProps {
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  format?: "comma" | "none"; // comma: 천단위 콤마
  disabled?: boolean;
}

export function NumberInput({
  value,
  onChange,
  placeholder = "숫자 입력",
  className = "",
  min,
  max,
  step = 1,
  suffix,
  prefix,
  format = "comma",
  disabled = false,
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // 숫자를 포맷된 문자열로 변환
  const formatNumber = useCallback((num: number | string): string => {
    const n = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(n)) return "";
    if (format === "comma") {
      return n.toLocaleString("ko-KR");
    }
    return n.toString();
  }, [format]);

  // 포맷된 문자열을 숫자로 변환
  const parseNumber = (str: string): number => {
    const cleaned = str.replace(/[^0-9.-]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // value 변경 시 displayValue 업데이트 (controlled component 동기화)
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value));
    }
  }, [value, isFocused, formatNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 포커스 중에는 숫자만 허용 (콤마 없이)
    const cleaned = inputValue.replace(/[^0-9.-]/g, "");
    setDisplayValue(cleaned);

    const num = parseFloat(cleaned) || 0;
    let finalValue = num;

    if (min !== undefined && finalValue < min) finalValue = min;
    if (max !== undefined && finalValue > max) finalValue = max;

    onChange(finalValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // 포커스 시 콤마 제거
    const num = parseNumber(displayValue);
    setDisplayValue(num === 0 ? "" : num.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    // 블러 시 포맷 적용
    const num = parseNumber(displayValue);
    setDisplayValue(formatNumber(num));
    onChange(num);
  };

  const increment = () => {
    if (disabled) return;
    const currentValue = typeof value === "string" ? parseFloat(value) : value;
    const newValue = (currentValue || 0) + step;
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  const decrement = () => {
    if (disabled) return;
    const currentValue = typeof value === "string" ? parseFloat(value) : value;
    const newValue = (currentValue || 0) - step;
    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  return (
    <div className={`relative flex ${className}`}>
      {/* 감소 버튼 */}
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || (min !== undefined && parseNumber(String(value)) <= min)}
        className="px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      {/* 입력 필드 */}
      <div className="relative flex-1">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 border-y border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg disabled:bg-gray-100 disabled:cursor-not-allowed
            ${prefix ? "pl-8" : ""}
            ${suffix ? "pr-10" : ""}
          `}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>

      {/* 증가 버튼 */}
      <button
        type="button"
        onClick={increment}
        disabled={disabled || (max !== undefined && parseNumber(String(value)) >= max)}
        className="px-3 bg-gray-100 border border-l-0 border-gray-200 rounded-r-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

// 금액 입력용 프리셋
export function MoneyInput({
  value,
  onChange,
  placeholder = "금액 입력",
  suffix = "원",
  ...props
}: Omit<NumberInputProps, "format" | "prefix">) {
  return (
    <NumberInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      suffix={suffix}
      format="comma"
      min={0}
      step={10000}
      {...props}
    />
  );
}

// 퍼센트 입력용 프리셋
export function PercentInput({
  value,
  onChange,
  placeholder = "0",
  min = 0,
  max = 100,
  step = 0.1,
  ...props
}: Omit<NumberInputProps, "format" | "suffix">) {
  return (
    <NumberInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      suffix="%"
      format="none"
      min={min}
      max={max}
      step={step}
      {...props}
    />
  );
}
