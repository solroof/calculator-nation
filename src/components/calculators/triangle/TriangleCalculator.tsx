"use client";

import { useState, useMemo } from 'react';
import { InteractiveTriangle, SelectedElement, ElementName } from './InteractiveTriangle';
import { TriangleResultCard } from './TriangleResultCard';
import { SSAModal } from './SSAModal';
import { triangleSolver } from '@/lib/math/triangle-solver';
import {
  TriangleInput,
  TriangleResult,
  SSAResult,
  isSSAResult,
  TriangleError,
} from '@/lib/types/triangle';

export function TriangleCalculator() {
  const [isRightTriangle, setIsRightTriangle] = useState<boolean | null>(null);
  const [target, setTarget] = useState<SelectedElement | null>(null);
  const [knownValues, setKnownValues] = useState<Record<string, number | null>>({
    a: null, b: null, c: null, A: null, B: null, C: null,
  });
  const [result, setResult] = useState<TriangleResult | null>(null);
  const [ssaResult, setSSAResult] = useState<SSAResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<ElementName | null>(null);

  const handleTriangleTypeSelect = (isRight: boolean) => {
    setIsRightTriangle(isRight);
    setTarget(null);
    setKnownValues({ a: null, b: null, c: null, A: null, B: null, C: null });
    setResult(null);
    setError(null);
  };

  const handleTargetSelect = (element: SelectedElement, resetValues = false) => {
    if (target?.name === element.name) {
      setTarget(null);
    } else {
      setTarget(element);
      if (resetValues) {
        setKnownValues({ a: null, b: null, c: null, A: null, B: null, C: null });
      } else {
        setKnownValues((prev) => ({ ...prev, [element.name]: null }));
      }
    }
    setResult(null);
    setError(null);
  };

  const handleValueChange = (name: ElementName, value: number | null) => {
    setKnownValues((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setTarget(null);
    setKnownValues({ a: null, b: null, c: null, A: null, B: null, C: null });
    setResult(null);
    setSSAResult(null);
    setError(null);
  };

  const handleBack = () => {
    setIsRightTriangle(null);
    handleClear();
  };

  const canCalculate = useMemo(() => {
    if (!target) return false;

    const combinations = isRightTriangle ? {
      a: [['b', 'c'], ['c', 'A'], ['b', 'A'], ['c', 'B'], ['b', 'B']],
      b: [['a', 'c'], ['c', 'B'], ['a', 'B'], ['c', 'A'], ['a', 'A']],
      c: [['a', 'b'], ['a', 'A'], ['b', 'B'], ['a', 'B'], ['b', 'A']],
      A: [['a', 'c'], ['a', 'b'], ['b', 'c']],
      B: [['b', 'c'], ['a', 'b'], ['a', 'c']],
      C: [],
    } : {
      a: [['b', 'c', 'A'], ['b', 'A', 'B'], ['c', 'A', 'C']],
      b: [['a', 'c', 'B'], ['a', 'A', 'B'], ['c', 'B', 'C']],
      c: [['a', 'b', 'C'], ['a', 'A', 'C'], ['b', 'B', 'C']],
      A: [['a', 'b', 'c'], ['B', 'C'], ['a', 'b', 'B']],
      B: [['a', 'b', 'c'], ['A', 'C'], ['a', 'b', 'A']],
      C: [['a', 'b', 'c'], ['A', 'B'], ['a', 'c', 'A']],
    };

    const targetCombos = combinations[target.name as keyof typeof combinations];
    if (!targetCombos) return false;

    return targetCombos.some((combo: string[]) =>
      combo.every((f: string) => knownValues[f] !== null)
    );
  }, [target, knownValues, isRightTriangle]);

  const handleCalculate = () => {
    setError(null);
    setResult(null);
    setSSAResult(null);

    try {
      const input: TriangleInput = {
        unit: { angle: 'deg', length: 'm' },
      };

      (['a', 'b', 'c'] as const).forEach((side) => {
        if (knownValues[side] !== null) {
          input[side] = knownValues[side]!;
        }
      });

      (['A', 'B', 'C'] as const).forEach((angle) => {
        if (knownValues[angle] !== null) {
          input[angle] = knownValues[angle]!;
        }
      });

      if (isRightTriangle) {
        input.C = 90;
      }

      const solveResult = triangleSolver.solve(input);

      if (isSSAResult(solveResult)) {
        if (solveResult.solutionCount === 1) {
          setResult(solveResult.solutions[0]);
        } else {
          setSSAResult(solveResult);
        }
      } else {
        setResult(solveResult);
      }
    } catch (e) {
      if (e instanceof TriangleError) {
        setError(e.message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleSSASelect = (selected: TriangleResult) => {
    setResult(selected);
    setSSAResult(null);
  };

  return (
    <div id="triangle" className="scroll-mt-20">
      {/* 계산기 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isRightTriangle !== null && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <h2 className="text-lg font-bold text-gray-800">삼각형 계산기</h2>
            {isRightTriangle !== null && (
              <p className="text-xs text-gray-500">
                {isRightTriangle ? '직각삼각형' : '일반 삼각형'}
              </p>
            )}
          </div>
        </div>
        <span className="text-2xl">📐</span>
      </div>

      {/* 삼각형 타입 선택 */}
      {isRightTriangle === null ? (
        <div className="space-y-4">
          <p className="text-center text-gray-600 text-sm">어떤 삼각형을 계산할까요?</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleTriangleTypeSelect(false)}
              className="bg-white rounded-2xl border-2 border-gray-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 active:scale-98 transition-all"
            >
              <svg viewBox="0 0 100 80" className="w-full h-20 mb-3">
                <polygon
                  points="50,10 10,70 90,70"
                  fill="rgba(59, 130, 246, 0.1)"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
              </svg>
              <p className="text-sm font-semibold text-gray-700">일반 삼각형</p>
              <p className="text-xs text-gray-400 mt-1">모든 각도 자유</p>
            </button>

            <button
              onClick={() => handleTriangleTypeSelect(true)}
              className="bg-white rounded-2xl border-2 border-gray-200 p-5 hover:border-purple-300 hover:bg-purple-50/50 active:scale-98 transition-all"
            >
              <svg viewBox="0 0 100 80" className="w-full h-20 mb-3">
                <polygon
                  points="10,10 10,70 90,70"
                  fill="rgba(139, 92, 246, 0.1)"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                />
                <rect x="10" y="58" width="12" height="12" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              </svg>
              <p className="text-sm font-semibold text-gray-700">직각삼각형</p>
              <p className="text-xs text-gray-400 mt-1">한 각이 90°</p>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 인터랙티브 삼각형 */}
          <InteractiveTriangle
            isRightTriangle={isRightTriangle}
            target={target}
            knownValues={knownValues}
            onTargetSelect={handleTargetSelect}
            onValueChange={handleValueChange}
            highlight={highlight}
          />

          {/* 버튼 영역 */}
          {target && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCalculate}
                disabled={!canCalculate}
                className={`
                  flex-1 py-3.5 rounded-xl font-medium text-base transition-all
                  ${canCalculate
                    ? 'bg-blue-500 text-white active:bg-blue-600 shadow-sm'
                    : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                계산하기
              </button>
              <button
                onClick={handleClear}
                className="px-5 py-3.5 rounded-xl font-medium text-gray-500 bg-white border border-gray-200 active:bg-gray-50 transition-all"
              >
                초기화
              </button>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-2 text-red-600">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* 결과 */}
          {result && (
            <div className="mt-4">
              <TriangleResultCard result={result} onHighlight={setHighlight} />
            </div>
          )}
        </>
      )}

      {/* SSA Modal */}
      {ssaResult && (
        <SSAModal
          ssaResult={ssaResult}
          onSelect={handleSSASelect}
          onClose={() => setSSAResult(null)}
        />
      )}

      {/* 계산 공식 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 피타고라스: c² = a² + b² (직각삼각형)</p>
          <p>• 코사인 법칙: c² = a² + b² - 2ab·cos(C)</p>
          <p>• 사인 법칙: a/sin(A) = b/sin(B) = c/sin(C)</p>
          <p>• 넓이: S = ½ab·sin(C) = √[s(s-a)(s-b)(s-c)]</p>
        </div>
      </div>
    </div>
  );
}
