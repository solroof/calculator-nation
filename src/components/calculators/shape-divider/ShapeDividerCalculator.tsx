"use client";

import { useState } from 'react';
import { shapeDividerSolver } from '@/lib/math/shape-divider-solver';
import type {
  ShapeDividerInput,
  ShapeDividerResult,
  ShapeType,
  DivisionMode,
  RemainderPolicy,
} from '@/lib/types/shape-divider';
import { ShapeDividerError } from '@/lib/types/shape-divider';

const SHAPE_OPTIONS: { value: ShapeType; label: string; icon: string }[] = [
  { value: 'rect', label: '직사각형', icon: '⬜' },
  { value: 'tri_line', label: '삼각형(직선)', icon: '📐' },
  { value: 'iso_tri', label: '이등변삼각형', icon: '🔺' },
  { value: 'circle', label: '원호', icon: '⭕' },
  { value: 'polygon', label: '다각형', icon: '⬡' },
];

const MODE_OPTIONS: { value: DivisionMode; label: string; desc: string }[] = [
  { value: 'interval', label: '간격 지정', desc: '일정 간격으로 분할' },
  { value: 'equal', label: '등분', desc: 'n등분으로 분할' },
];

const REMAINDER_OPTIONS: { value: RemainderPolicy; label: string }[] = [
  { value: 'uniform', label: '균등 분배' },
  { value: 'last', label: '마지막에 추가' },
  { value: 'spread', label: '전체 분산' },
];

export function ShapeDividerCalculator() {
  // 기본 설정
  const [mode, setMode] = useState<DivisionMode>('equal');
  const [shapeType, setShapeType] = useState<ShapeType>('rect');

  // 분할 파라미터
  const [L, setL] = useState<string>('6');
  const [s, setS] = useState<string>('0.43');
  const [n, setN] = useState<string>('14');
  const [y0, setY0] = useState<string>('0');
  const [precision, setPrecision] = useState<string>('2');
  const [remainderPolicy, setRemainderPolicy] = useState<RemainderPolicy>('uniform');

  // 형상 파라미터
  const [rectH, setRectH] = useState<string>('2');
  const [triM, setTriM] = useState<string>('0.333333');
  const [triB, setTriB] = useState<string>('0');
  const [isoXc, setIsoXc] = useState<string>('3');
  const [isoMl, setIsoMl] = useState<string>('1');
  const [isoBl, setIsoBl] = useState<string>('0');
  const [isoMr, setIsoMr] = useState<string>('-1');
  const [isoBr, setIsoBr] = useState<string>('6');
  const [circleXc, setCircleXc] = useState<string>('3');
  const [circleYc, setCircleYc] = useState<string>('0');
  const [circleR, setCircleR] = useState<string>('3');
  const [polygonPoints, setPolygonPoints] = useState<string>('0,0;3,3;6,0');

  // 옵션
  const [useHeight] = useState(true);
  const [useMirror, setUseMirror] = useState(false);
  const [clampNegative, setClampNegative] = useState(true);

  // 결과
  const [result, setResult] = useState<ShapeDividerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buildInput = (): ShapeDividerInput => {
    const params = {
      L: parseFloat(L),
      s: mode === 'interval' ? parseFloat(s) : undefined,
      n: mode === 'equal' ? parseInt(n) : undefined,
      y0: parseFloat(y0),
      precision: parseInt(precision),
      remainderPolicy,
      clampNegativeHeight: clampNegative,
    };

    let shape: ShapeDividerInput['shape'];

    switch (shapeType) {
      case 'rect':
        shape = { type: 'rect', params: { H: parseFloat(rectH) } };
        break;
      case 'tri_line':
        shape = { type: 'tri_line', params: { m: parseFloat(triM), b: parseFloat(triB) } };
        break;
      case 'iso_tri':
        shape = {
          type: 'iso_tri',
          params: {
            xc: parseFloat(isoXc),
            ml: parseFloat(isoMl),
            bl: parseFloat(isoBl),
            mr: parseFloat(isoMr),
            br: parseFloat(isoBr),
          },
        };
        break;
      case 'circle':
        shape = {
          type: 'circle',
          params: {
            xc: parseFloat(circleXc),
            yc: parseFloat(circleYc),
            R: parseFloat(circleR),
          },
        };
        break;
      case 'polygon':
        const points = polygonPoints.split(';').map((p) => {
          const [x, y] = p.split(',').map(Number);
          return [x, y] as [number, number];
        });
        shape = { type: 'polygon', params: { points } };
        break;
      default:
        throw new Error('Invalid shape type');
    }

    return {
      mode,
      options: { height: useHeight, mirror: useMirror },
      shape,
      params,
    };
  };

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    try {
      const input = buildInput();
      const calcResult = shapeDividerSolver.solve(input);
      setResult(calcResult);
    } catch (e) {
      if (e instanceof ShapeDividerError) {
        setError(e.message);
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
  };

  const renderShapeParams = () => {
    switch (shapeType) {
      case 'rect':
        return (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-600">높이 (H)</span>
              <input
                type="number"
                value={rectH}
                onChange={(e) => setRectH(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.1"
              />
            </label>
          </div>
        );
      case 'tri_line':
        return (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">y = mx + b</p>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-gray-600">기울기 (m)</span>
                <input
                  type="number"
                  value={triM}
                  onChange={(e) => setTriM(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">y절편 (b)</span>
                <input
                  type="number"
                  value={triB}
                  onChange={(e) => setTriB(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </label>
            </div>
          </div>
        );
      case 'iso_tri':
        return (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-600">꼭짓점 X (xc)</span>
              <input
                type="number"
                value={isoXc}
                onChange={(e) => setIsoXc(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.1"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-2">왼쪽 (y = ml*x + bl)</p>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={isoMl}
                    onChange={(e) => setIsoMl(e.target.value)}
                    placeholder="ml"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={isoBl}
                    onChange={(e) => setIsoBl(e.target.value)}
                    placeholder="bl"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    step="0.1"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">오른쪽 (y = mr*x + br)</p>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={isoMr}
                    onChange={(e) => setIsoMr(e.target.value)}
                    placeholder="mr"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={isoBr}
                    onChange={(e) => setIsoBr(e.target.value)}
                    placeholder="br"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'circle':
        return (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">(x-xc)&sup2; + (y-yc)&sup2; = R&sup2;</p>
            <div className="grid grid-cols-3 gap-3">
              <label className="block">
                <span className="text-sm text-gray-600">중심 X</span>
                <input
                  type="number"
                  value={circleXc}
                  onChange={(e) => setCircleXc(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">중심 Y</span>
                <input
                  type="number"
                  value={circleYc}
                  onChange={(e) => setCircleYc(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">반지름 R</span>
                <input
                  type="number"
                  value={circleR}
                  onChange={(e) => setCircleR(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </label>
            </div>
          </div>
        );
      case 'polygon':
        return (
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-600">점 목록 (x,y;x,y;...)</span>
              <input
                type="text"
                value={polygonPoints}
                onChange={(e) => setPolygonPoints(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="0,0;3,3;6,0"
              />
            </label>
            <p className="text-xs text-gray-400">예: 0,0;3,3;6,0 (세미콜론으로 구분)</p>
          </div>
        );
    }
  };

  return (
    <div id="shape-divider" className="scroll-mt-20">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">형상 분할 계산기</h2>
          <p className="text-xs text-gray-500">다양한 형상에서 등간격 높이 계산</p>
        </div>
        <span className="text-2xl">📊</span>
      </div>

      {/* 모드 선택 */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">분할 모드</p>
        <div className="grid grid-cols-2 gap-2">
          {MODE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                mode === opt.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs text-gray-500">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 형상 선택 */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">형상</p>
        <div className="flex flex-wrap gap-2">
          {SHAPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setShapeType(opt.value)}
              className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${
                shapeType === opt.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="mr-1">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 기본 파라미터 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">기본 설정</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-gray-600">전체 길이 (L)</span>
            <input
              type="number"
              value={L}
              onChange={(e) => setL(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.1"
            />
          </label>
          {mode === 'interval' ? (
            <label className="block">
              <span className="text-sm text-gray-600">간격 (s)</span>
              <input
                type="number"
                value={s}
                onChange={(e) => setS(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.01"
              />
            </label>
          ) : (
            <label className="block">
              <span className="text-sm text-gray-600">분할 수 (n)</span>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </label>
          )}
          <label className="block">
            <span className="text-sm text-gray-600">기준 높이 (y0)</span>
            <input
              type="number"
              value={y0}
              onChange={(e) => setY0(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.1"
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-600">소수점 자릿수</span>
            <input
              type="number"
              value={precision}
              onChange={(e) => setPrecision(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="6"
            />
          </label>
        </div>

        {mode === 'interval' && (
          <div className="mt-3">
            <span className="text-sm text-gray-600">나머지 처리</span>
            <div className="flex gap-2 mt-1">
              {REMAINDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRemainderPolicy(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    remainderPolicy === opt.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 형상 파라미터 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          형상 파라미터 ({SHAPE_OPTIONS.find((o) => o.value === shapeType)?.label})
        </p>
        {renderShapeParams()}
      </div>

      {/* 옵션 */}
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useMirror}
            onChange={(e) => setUseMirror(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">좌우 대칭</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={clampNegative}
            onChange={(e) => setClampNegative(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">음수 높이 0 처리</span>
        </label>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCalculate}
          className="flex-1 py-3.5 rounded-xl font-medium text-base bg-blue-500 text-white active:bg-blue-600 shadow-sm transition-all"
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

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
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
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* 요약 */}
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">분할 수</p>
                <p className="text-lg font-bold text-blue-600">{result.n}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">간격</p>
                <p className="text-lg font-bold text-blue-600">{result.step}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">나머지</p>
                <p className="text-lg font-bold text-blue-600">{result.remainder}</p>
              </div>
            </div>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-gray-600 font-medium">i</th>
                  <th className="px-3 py-2 text-right text-gray-600 font-medium">x</th>
                  <th className="px-3 py-2 text-right text-gray-600 font-medium">h</th>
                  <th className="px-3 py-2 text-right text-gray-600 font-medium">dh</th>
                  <th className="px-3 py-2 text-right text-gray-600 font-medium">theta</th>
                  <th className="px-3 py-2 text-right text-gray-600 font-medium">slope%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.rows.map((row) => (
                  <tr key={row.i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-800 font-medium">{row.i}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{row.x}</td>
                    <td className="px-3 py-2 text-right text-blue-600 font-medium">{row.h}</td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {row.dh !== null ? row.dh : '-'}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {row.theta !== null ? `${row.theta}°` : '-'}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">
                      {row.slopePct !== null ? `${row.slopePct}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 계산 공식 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm font-medium text-gray-700 mb-2">계산 공식</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• 등분: 간격 s = L ÷ n</p>
          <p>• 간격 지정: 분할 수 n = floor(L ÷ s)</p>
          <p>• 직사각형: h(x) = H</p>
          <p>• 삼각형: h(x) = mx + b</p>
          <p>• 원호: h(x) = yc + √(R² - (x-xc)²)</p>
        </div>
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          <p className="font-medium mb-1">결과값</p>
          <p>• dh: 이전 점과의 높이 차이</p>
          <p>• theta: 경사각 = atan(dh/s)</p>
          <p>• slope%: 경사도 = (dh/s) × 100</p>
        </div>
      </div>
    </div>
  );
}
