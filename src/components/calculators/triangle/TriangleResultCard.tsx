"use client";

import { TriangleResult as TResult } from '@/lib/types/triangle';

type HighlightElement = 'a' | 'b' | 'c' | 'A' | 'B' | 'C' | null;

interface TriangleResultCardProps {
  result: TResult;
  onHighlight?: (element: HighlightElement) => void;
}

const formatNumber = (num: number): string => {
  return parseFloat(num.toFixed(2)).toString();
};

const typeLabels: Record<string, { label: string; bg: string; text: string }> = {
  right: { label: '직각', bg: 'bg-green-100', text: 'text-green-700' },
  acute: { label: '예각', bg: 'bg-blue-100', text: 'text-blue-700' },
  obtuse: { label: '둔각', bg: 'bg-amber-100', text: 'text-amber-700' },
};

const THEORY_CONTENT: Record<string, { title: string; formula: string; description: string }> = {
  cosine: {
    title: '코사인 법칙 (Law of Cosines)',
    formula: 'c² = a² + b² - 2ab·cos(C)',
    description: '삼각형의 두 변과 그 끼인각을 알 때, 또는 세 변을 알 때 각도를 구할 수 있습니다. 피타고라스 정리의 일반화된 형태입니다.',
  },
  sine: {
    title: '사인 법칙 (Law of Sines)',
    formula: 'a/sin(A) = b/sin(B) = c/sin(C)',
    description: '삼각형에서 각 변과 그 대각의 사인값의 비는 항상 같습니다. 이를 이용해 미지의 변이나 각을 구할 수 있습니다.',
  },
  pythagoras: {
    title: '피타고라스 정리',
    formula: 'c² = a² + b² (직각삼각형)',
    description: '직각삼각형에서 빗변의 제곱은 나머지 두 변의 제곱의 합과 같습니다.',
  },
  heron: {
    title: '헤론의 공식',
    formula: 'S = √[s(s-a)(s-b)(s-c)], s = (a+b+c)/2',
    description: '세 변의 길이만으로 삼각형의 넓이를 구할 수 있는 공식입니다.',
  },
  angleSum: {
    title: '삼각형 내각의 합',
    formula: 'A + B + C = 180°',
    description: '삼각형의 세 내각의 합은 항상 180도입니다.',
  },
};

export function TriangleResultCard({ result, onHighlight }: TriangleResultCardProps) {
  const {
    a, b, c,
    ADeg, BDeg, CDeg,
    area, perimeter,
    type,
    steps,
    inputType,
  } = result;

  const typeInfo = typeLabels[type];

  const usedTheories = (): string[] => {
    const theories: string[] = [];
    if (inputType === 'SSS') {
      theories.push('cosine', 'heron');
    } else if (inputType === 'SAS') {
      theories.push('cosine', 'heron');
    } else if (inputType === 'ASA' || inputType === 'AAS') {
      theories.push('angleSum', 'sine', 'heron');
    } else if (inputType === 'RHS') {
      theories.push('pythagoras');
    } else if (inputType === 'SSA') {
      theories.push('sine', 'heron');
    }
    return theories;
  };

  const handleHighlight = (element: HighlightElement) => {
    onHighlight?.(element);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">계산 결과</span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo.bg} ${typeInfo.text}`}>
          {typeInfo.label}삼각형
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-gray-100">
        <div className="bg-blue-50 p-4 text-center">
          <div className="text-xs text-blue-600 mb-1">면적</div>
          <div className="text-xl font-bold text-blue-700 font-mono">{formatNumber(area)} cm²</div>
        </div>
        <div className="bg-blue-50 p-4 text-center">
          <div className="text-xs text-blue-600 mb-1">둘레</div>
          <div className="text-xl font-bold text-blue-700 font-mono">{formatNumber(perimeter)} cm</div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'a', value: a },
            { label: 'b', value: b },
            { label: 'c', value: c },
          ].map(({ label, value }) => (
            <div
              key={label}
              onMouseEnter={() => handleHighlight(label as HighlightElement)}
              onMouseLeave={() => handleHighlight(null)}
              className="bg-gray-50 rounded-lg p-2.5 text-center transition-all hover:bg-blue-50 cursor-default"
            >
              <div className="text-xs text-gray-500">변 {label}</div>
              <div className="text-sm font-medium font-mono mt-0.5">{formatNumber(value)} cm</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'A', value: ADeg },
            { label: 'B', value: BDeg },
            { label: 'C', value: CDeg },
          ].map(({ label, value }) => (
            <div
              key={label}
              onMouseEnter={() => handleHighlight(label as HighlightElement)}
              onMouseLeave={() => handleHighlight(null)}
              className="bg-gray-50 rounded-lg p-2.5 text-center transition-all hover:bg-blue-50 cursor-default"
            >
              <div className="text-xs text-gray-500">각 {label}</div>
              <div className="text-sm font-medium font-mono mt-0.5">{formatNumber(value)}°</div>
            </div>
          ))}
        </div>
      </div>

      <details className="border-t border-gray-100" open>
        <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
          <span>풀이 과정</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-4 pb-4">
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-mono leading-relaxed">{step}</p>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-3 border-t border-slate-200">
              <p className="text-sm font-medium text-gray-700 mb-2">최종 결과:</p>
              <div className="bg-white rounded-lg p-3 font-mono text-sm space-y-1">
                <p>a = {formatNumber(a)} cm, b = {formatNumber(b)} cm, c = {formatNumber(c)} cm</p>
                <p>A = {formatNumber(ADeg)}°, B = {formatNumber(BDeg)}°, C = {formatNumber(CDeg)}°</p>
                <p>면적 = {formatNumber(area)} cm²</p>
              </div>
            </div>
          </div>
        </div>
      </details>

      <details className="border-t border-gray-100" open>
        <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
          <span>관련 이론 및 공식</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-4 pb-4 space-y-3">
          {usedTheories().map((theoryKey) => {
            const theory = THEORY_CONTENT[theoryKey];
            return (
              <div key={theoryKey} className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <h4 className="text-sm font-bold text-amber-800 mb-2">{theory.title}</h4>
                <div className="bg-white rounded-lg p-3 mb-2 font-mono text-sm text-center text-amber-900 border border-amber-200">
                  {theory.formula}
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">{theory.description}</p>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
