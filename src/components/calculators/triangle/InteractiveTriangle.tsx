"use client";

import { useState, useMemo } from 'react';

export type ElementName = 'a' | 'b' | 'c' | 'A' | 'B' | 'C';

export interface SelectedElement {
  type: 'side' | 'angle';
  name: ElementName;
}

interface InteractiveTriangleProps {
  isRightTriangle: boolean;
  target: SelectedElement | null;
  knownValues: Record<string, number | null>;
  onTargetSelect: (element: SelectedElement, resetValues?: boolean) => void;
  onValueChange: (name: ElementName, value: number | null) => void;
  highlight?: ElementName | null;
}

// 계산에 필요한 조합들
const REQUIRED_COMBINATIONS: Record<string, Record<ElementName, ElementName[][]>> = {
  general: {
    a: [
      ['b', 'c', 'A'],
      ['b', 'A', 'B'],
      ['c', 'A', 'C'],
    ],
    b: [
      ['a', 'c', 'B'],
      ['a', 'A', 'B'],
      ['c', 'B', 'C'],
    ],
    c: [
      ['a', 'b', 'C'],
      ['a', 'A', 'C'],
      ['b', 'B', 'C'],
    ],
    A: [
      ['a', 'b', 'c'],
      ['B', 'C'],
      ['a', 'b', 'B'],
    ],
    B: [
      ['a', 'b', 'c'],
      ['A', 'C'],
      ['a', 'b', 'A'],
    ],
    C: [
      ['a', 'b', 'c'],
      ['A', 'B'],
      ['a', 'c', 'A'],
    ],
  },
  right: {
    a: [
      ['b', 'c'],
      ['c', 'A'],
      ['b', 'A'],
      ['c', 'B'],
      ['b', 'B'],
    ],
    b: [
      ['a', 'c'],
      ['c', 'B'],
      ['a', 'B'],
      ['c', 'A'],
      ['a', 'A'],
    ],
    c: [
      ['a', 'b'],
      ['a', 'A'],
      ['b', 'B'],
      ['a', 'B'],
      ['b', 'A'],
    ],
    A: [
      ['a', 'c'],
      ['a', 'b'],
      ['b', 'c'],
    ],
    B: [
      ['b', 'c'],
      ['a', 'b'],
      ['a', 'c'],
    ],
    C: [],
  },
};

export function InteractiveTriangle({
  isRightTriangle,
  target,
  knownValues,
  onTargetSelect,
  onValueChange,
  highlight,
}: InteractiveTriangleProps) {
  const [editingField, setEditingField] = useState<ElementName | null>(null);
  const [inputValue, setInputValue] = useState('');

  const combinations = isRightTriangle ? REQUIRED_COMBINATIONS.right : REQUIRED_COMBINATIONS.general;

  const enabledFields = useMemo(() => {
    if (!target) return new Set<ElementName>();

    const targetCombos = combinations[target.name];
    if (!targetCombos || targetCombos.length === 0) return new Set<ElementName>();

    const filledFields = Object.entries(knownValues)
      .filter(([, v]) => v !== null)
      .map(([k]) => k as ElementName);

    if (filledFields.length === 0) {
      const allPossible = new Set<ElementName>();
      targetCombos.forEach(combo => combo.forEach(f => allPossible.add(f)));
      return allPossible;
    }

    const validCombos = targetCombos.filter(combo =>
      filledFields.every(f => combo.includes(f))
    );

    const remaining = new Set<ElementName>();
    validCombos.forEach(combo => {
      combo.forEach(f => {
        if (knownValues[f] === null) remaining.add(f);
      });
    });

    return remaining;
  }, [target, knownValues, combinations]);

  const isTarget = (name: ElementName) => target?.name === name;
  const hasValue = (name: ElementName) => knownValues[name] !== null;
  const isEnabled = (name: ElementName) => enabledFields.has(name);
  const isDisabled = (name: ElementName) => target !== null && !isTarget(name) && !isEnabled(name) && !hasValue(name);

  const handleElementClick = (type: 'side' | 'angle', name: ElementName) => {
    if (editingField) return;

    if (isRightTriangle && name === 'C') return;

    if (!target) {
      onTargetSelect({ type, name }, false);
    } else if (isTarget(name)) {
      onTargetSelect({ type, name }, false);
    } else if (hasValue(name)) {
      setEditingField(name);
      setInputValue(String(knownValues[name]));
    } else if (isEnabled(name)) {
      setEditingField(name);
      setInputValue('');
    } else {
      onTargetSelect({ type, name }, true);
    }
  };

  const handleClearValue = (e: React.MouseEvent, name: ElementName) => {
    e.stopPropagation();
    onValueChange(name, null);
  };

  const handleInputSubmit = (name: ElementName) => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      onValueChange(name, value);
    } else if (inputValue === '') {
      onValueChange(name, null);
    }
    setEditingField(null);
    setInputValue('');
  };

  const isHighlighted = (name: ElementName) => highlight === name;

  const getElementStyle = (name: ElementName) => {
    if (isHighlighted(name)) {
      return { color: '#f97316', fill: '#fff7ed', border: 'border-orange-400', text: 'text-orange-600' };
    }
    if (isRightTriangle && name === 'C') {
      return { color: '#8b5cf6', fill: '#f3e8ff', border: 'border-purple-300', text: 'text-purple-600' };
    }
    if (isTarget(name)) {
      return { color: '#ef4444', fill: '#fef2f2', border: 'border-red-300', text: 'text-red-600' };
    }
    if (hasValue(name)) {
      return { color: '#22c55e', fill: '#f0fdf4', border: 'border-green-300', text: 'text-green-600' };
    }
    if (isEnabled(name)) {
      return { color: '#3b82f6', fill: '#eff6ff', border: 'border-blue-300', text: 'text-blue-600' };
    }
    return { color: '#d1d5db', fill: '#f9fafb', border: 'border-gray-200', text: 'text-gray-400' };
  };

  const A = isRightTriangle ? { x: 320, y: 70 } : { x: 200, y: 70 };
  const B = { x: 80, y: 270 };
  const C = isRightTriangle ? { x: 320, y: 270 } : { x: 320, y: 270 };

  const midA = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
  const midB = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
  const midC = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };

  const renderInputBox = (name: ElementName, x: number, y: number, isAngle: boolean) => {
    const style = getElementStyle(name);
    const isEditing = editingField === name;
    const value = knownValues[name];
    const disabled = isDisabled(name);

    const boxWidth = 100;
    const boxHeight = 36;

    if (isRightTriangle && name === 'C') {
      return (
        <foreignObject x={x - boxWidth/2} y={y - boxHeight/2} width={boxWidth} height={boxHeight} style={{ overflow: 'visible' }}>
          <div className="flex items-center justify-center h-full px-3 rounded-xl border-2 border-purple-300 bg-purple-50">
            <span className="text-sm font-bold text-purple-600 whitespace-nowrap">C = 90°</span>
          </div>
        </foreignObject>
      );
    }

    if (isEditing) {
      return (
        <foreignObject x={x - boxWidth/2} y={y - boxHeight/2} width={boxWidth} height={boxHeight} style={{ overflow: 'visible' }}>
          <div className="flex items-center justify-center gap-1 h-full">
            <input
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleInputSubmit(name);
                if (e.key === 'Escape') setEditingField(null);
              }}
              onBlur={() => handleInputSubmit(name)}
              autoFocus
              className="w-20 px-2 py-2 text-sm border-2 border-blue-400 rounded-xl text-center focus:outline-none bg-white"
              placeholder="0"
            />
            {isAngle && <span className="text-sm text-gray-500">°</span>}
          </div>
        </foreignObject>
      );
    }

    return (
      <foreignObject x={x - boxWidth/2} y={y - boxHeight/2} width={boxWidth + (value !== null ? 24 : 0)} height={boxHeight} style={{ overflow: 'visible' }}>
        <div className="flex items-center gap-1 h-full">
          <button
            onClick={() => handleElementClick(isAngle ? 'angle' : 'side', name)}
            disabled={disabled}
            className={`
              h-full flex items-center justify-center gap-1 rounded-xl border-2 px-3
              ${style.border} transition-all
              ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'}
            `}
            style={{ backgroundColor: style.fill, minWidth: '80px' }}
          >
            <span className={`text-sm font-semibold ${style.text} whitespace-nowrap`}>{name}</span>
            {value !== null ? (
              <span className={`text-sm font-bold ${style.text} whitespace-nowrap`}>
                = {value}{isAngle ? '°' : ''}
              </span>
            ) : (
              <span className={`text-sm ${style.text}`}>?</span>
            )}
          </button>
          {value !== null && !isTarget(name) && (
            <button
              onClick={(e) => handleClearValue(e, name)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </foreignObject>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 overflow-visible">
      <div className="text-center mb-3">
        {!target ? (
          <p className="text-sm text-gray-600">
            <span className="text-red-500 font-semibold">구하고 싶은 값</span>을 클릭하세요
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            <span className="text-blue-500 font-semibold">파란색 필드</span>를 클릭하여 값을 입력하세요
          </p>
        )}
      </div>

      <div className="flex justify-center gap-3 mb-3 text-[11px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-red-300 bg-red-50"></div>
          <span className="text-gray-500">구할 값</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-blue-300 bg-blue-50"></div>
          <span className="text-gray-500">입력 가능</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-green-300 bg-green-50"></div>
          <span className="text-gray-500">입력됨</span>
        </div>
      </div>

      <svg viewBox="0 0 420 360" className="w-full max-w-[400px] mx-auto" style={{ overflow: 'visible' }}>
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill="rgba(59, 130, 246, 0.03)"
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke={getElementStyle('a').color} strokeWidth={isHighlighted('a') || isTarget('a') || hasValue('a') ? 4 : 2} />
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke={getElementStyle('b').color} strokeWidth={isHighlighted('b') || isTarget('b') || hasValue('b') ? 4 : 2} />
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={getElementStyle('c').color} strokeWidth={isHighlighted('c') || isTarget('c') || hasValue('c') ? 4 : 2} />

        {isRightTriangle && (
          <rect x={C.x - 20} y={C.y - 20} width="20" height="20" fill="none" stroke="#8b5cf6" strokeWidth="2" />
        )}

        <circle cx={A.x} cy={A.y} r={isHighlighted('A') ? 8 : 6} fill={getElementStyle('A').color} />
        <circle cx={B.x} cy={B.y} r={isHighlighted('B') ? 8 : 6} fill={getElementStyle('B').color} />
        <circle cx={C.x} cy={C.y} r={isHighlighted('C') ? 8 : 6} fill={getElementStyle('C').color} />

        {(isHighlighted('A') || isTarget('A') || hasValue('A')) && !isRightTriangle && (
          <path d={`M ${A.x - 15},${A.y + 22} Q ${A.x},${A.y + 35} ${A.x + 15},${A.y + 22}`} fill="none" stroke={getElementStyle('A').color} strokeWidth="2" />
        )}
        {(isHighlighted('A') || isTarget('A') || hasValue('A')) && isRightTriangle && (
          <path d={`M ${A.x - 18},${A.y + 5} Q ${A.x - 22},${A.y + 20} ${A.x - 5},${A.y + 22}`} fill="none" stroke={getElementStyle('A').color} strokeWidth="2" />
        )}
        {(isHighlighted('B') || isTarget('B') || hasValue('B')) && (
          <path d={`M ${B.x + 22},${B.y} Q ${B.x + 30},${B.y - 18} ${B.x + 10},${B.y - 25}`} fill="none" stroke={getElementStyle('B').color} strokeWidth="2" />
        )}

        {renderInputBox('a', midA.x, midA.y + 35, false)}
        {renderInputBox('b', midB.x + 65, isRightTriangle ? midB.y - 25 : midB.y - 35, false)}
        {renderInputBox('c', isRightTriangle ? midC.x - 55 : midC.x - 55, isRightTriangle ? midC.y - 40 : midC.y - 35, false)}

        {renderInputBox('A', isRightTriangle ? A.x + 50 : A.x, isRightTriangle ? A.y - 30 : A.y - 45, true)}
        {renderInputBox('B', B.x - 50, B.y + 35, true)}
        {renderInputBox('C', isRightTriangle ? C.x + 50 : C.x + 60, C.y + 35, true)}
      </svg>
    </div>
  );
}
