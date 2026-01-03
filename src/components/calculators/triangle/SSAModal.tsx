"use client";

import { SSAResult, TriangleResult } from '@/lib/types/triangle';

interface SSAModalProps {
  ssaResult: SSAResult;
  onSelect: (result: TriangleResult) => void;
  onClose: () => void;
}

const typeLabels: Record<string, string> = {
  right: '직각삼각형',
  acute: '예각삼각형',
  obtuse: '둔각삼각형',
};

export function SSAModal({ ssaResult, onSelect, onClose }: SSAModalProps) {
  const { solutionCount, solutions, reason } = ssaResult;

  if (solutionCount === 0) {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl p-6 max-w-md w-[90%] shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            삼각형을 만들 수 없습니다
          </h3>
          <p className="text-gray-500 mb-4">{reason}</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <span className="text-red-600">
              주어진 조건으로는 유효한 삼각형이 존재하지 않습니다.
            </span>
          </div>
          <button
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-md w-[90%] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          SSA 다중 해: {solutionCount}개의 삼각형
        </h3>
        <p className="text-gray-500 mb-4">{reason}</p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <span className="text-amber-700 text-sm">
            두 변과 대각(SSA)이 주어진 경우, 여러 개의 삼각형이 가능할 수 있습니다.
            원하는 삼각형을 선택하세요.
          </span>
        </div>

        <div className="space-y-3 mb-4">
          {solutions.map((sol, index) => (
            <button
              key={index}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              onClick={() => onSelect(sol)}
            >
              <div className="font-semibold text-gray-800 mb-2">
                해 {index + 1}: {typeLabels[sol.type]}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                <div>각 A: {sol.ADeg.toFixed(2)}°</div>
                <div>각 B: {sol.BDeg.toFixed(2)}°</div>
                <div>각 C: {sol.CDeg.toFixed(2)}°</div>
                <div>면적: {sol.area.toFixed(2)}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          className="w-full py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          onClick={onClose}
        >
          취소
        </button>
      </div>
    </div>
  );
}
