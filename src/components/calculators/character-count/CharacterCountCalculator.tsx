"use client";

import { useState, useMemo } from "react";
import { characterCountCalculator } from "@/lib/math/character-count-calculator";

export function CharacterCountCalculator() {
  const [text, setText] = useState<string>("");

  const result = useMemo(() => {
    return characterCountCalculator.calculate(text);
  }, [text]);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        글자수 계산기
      </h2>

      <div className="space-y-4 mb-6">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-[150px] resize-y"
            placeholder="글자수를 세고 싶은 텍스트를 입력하세요..."
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* 주요 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">글자 수 (공백 포함)</div>
            <div className="text-2xl font-bold text-blue-600">{result.totalChars}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">글자 수 (공백 제외)</div>
            <div className="text-2xl font-bold text-green-600">{result.charsNoSpaces}</div>
          </div>
        </div>

        {/* 상세 통계 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-800">{result.words}</div>
              <div className="text-xs text-gray-500">단어</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">{result.sentences}</div>
              <div className="text-xs text-gray-500">문장</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">{result.lines}</div>
              <div className="text-xs text-gray-500">줄</div>
            </div>
          </div>
        </div>

        {/* 문자 유형별 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-3">문자 유형</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">한글</span>
              <span className="font-medium">{result.koreanChars}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">영문</span>
              <span className="font-medium">{result.englishChars}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">숫자</span>
              <span className="font-medium">{result.numbers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">공백</span>
              <span className="font-medium">{result.spaces}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">특수문자</span>
              <span className="font-medium">{result.specialChars}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">바이트</span>
              <span className="font-medium">{result.bytes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
