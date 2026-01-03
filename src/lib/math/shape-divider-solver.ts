import type {
  ShapeDividerInput,
  ShapeDividerResult,
  DivisionRow,
  ShapeDefinition,
  RectParams,
  TriLineParams,
  IsoTriParams,
  CircleParams,
  PolygonParams,
  RemainderPolicy,
} from '../types/shape-divider';
import { ShapeDividerError } from '../types/shape-divider';

const RAD_TO_DEG = 180 / Math.PI;

/**
 * 형상 분할 계산기
 */
export class ShapeDividerSolver {
  private precision: number;

  constructor(precision = 2) {
    this.precision = precision;
  }

  /**
   * 메인 계산 함수
   */
  solve(input: ShapeDividerInput): ShapeDividerResult {
    this.validate(input);

    const { mode, shape, params, options } = input;
    const L = params.L;
    const y0 = params.y0 ?? 0;
    const precision = params.precision ?? this.precision;
    const clampNegative = params.clampNegativeHeight ?? true;
    const remainderPolicy = params.remainderPolicy ?? 'uniform';

    // 분할 수와 간격 계산
    let n: number;
    let step: number;
    let remainder: number;

    if (mode === 'interval') {
      const s = params.s!;
      n = Math.floor(L / s);
      step = s;
      remainder = L - n * s;

      // 나머지 처리
      if (remainder > 0 && remainderPolicy === 'uniform') {
        // uniform: 간격을 조정하여 나머지 분배
        step = L / n;
        remainder = 0;
      }
    } else {
      // equal 모드
      n = params.n!;
      step = L / n;
      remainder = 0;
    }

    // x 좌표 배열 생성
    const xPositions = this.generateXPositions(L, n, step, remainder, remainderPolicy);

    // 각 x 좌표에서 높이 계산
    const rows: DivisionRow[] = [];
    let prevH: number | null = null;
    let prevX: number | null = null;

    for (let i = 0; i <= n; i++) {
      const x = xPositions[i];
      let h = this.calculateHeight(shape, x, y0);

      // 음수 높이 처리
      if (clampNegative && h < 0) {
        h = 0;
      }

      // mirror 옵션 처리 (L/2 기준 대칭)
      if (options?.mirror && x > L / 2) {
        const mirrorX = L - x;
        h = this.calculateHeight(shape, mirrorX, y0);
        if (clampNegative && h < 0) h = 0;
      }

      // 높이 차, 각도, 경사율 계산
      let dh: number | null = null;
      let theta: number | null = null;
      let slopePct: number | null = null;

      if (prevH !== null && prevX !== null) {
        dh = h - prevH;
        const dx = x - prevX;
        if (dx !== 0) {
          const slope = dh / dx;
          theta = Math.atan(slope) * RAD_TO_DEG;
          slopePct = slope * 100;
        }
      }

      rows.push({
        i,
        x: this.round(x, precision),
        h: this.round(h, precision),
        dh: dh !== null ? this.round(dh, precision) : null,
        theta: theta !== null ? this.round(theta, precision) : null,
        slopePct: slopePct !== null ? this.round(slopePct, precision) : null,
      });

      prevH = h;
      prevX = x;
    }

    return {
      n,
      step: this.round(step, precision),
      remainder: this.round(remainder, precision),
      rows,
    };
  }

  /**
   * x 좌표 배열 생성 (나머지 정책 적용)
   */
  private generateXPositions(
    L: number,
    n: number,
    step: number,
    remainder: number,
    policy: RemainderPolicy
  ): number[] {
    const positions: number[] = [];

    if (policy === 'uniform' || remainder === 0) {
      // 균등 분배
      for (let i = 0; i <= n; i++) {
        positions.push(i * step);
      }
    } else if (policy === 'last') {
      // 나머지를 마지막에 추가
      for (let i = 0; i < n; i++) {
        positions.push(i * step);
      }
      positions.push(L);
    } else if (policy === 'spread') {
      // 나머지를 모든 간격에 분산
      const adjustedStep = L / n;
      for (let i = 0; i <= n; i++) {
        positions.push(i * adjustedStep);
      }
    }

    return positions;
  }

  /**
   * 형상에 따른 높이 계산
   */
  private calculateHeight(shape: ShapeDefinition, x: number, y0: number): number {
    switch (shape.type) {
      case 'rect':
        return this.calcRect(shape.params, y0);
      case 'tri_line':
        return this.calcTriLine(shape.params, x, y0);
      case 'iso_tri':
        return this.calcIsoTri(shape.params, x, y0);
      case 'circle':
        return this.calcCircle(shape.params, x, y0);
      case 'polygon':
        return this.calcPolygon(shape.params, x, y0);
      default:
        throw new ShapeDividerError('INVALID_SHAPE', '지원하지 않는 형상입니다.');
    }
  }

  /**
   * 직사각형: 일정한 높이
   */
  private calcRect(params: RectParams, y0: number): number {
    return params.H - y0;
  }

  /**
   * 삼각형(직선): y = mx + b
   */
  private calcTriLine(params: TriLineParams, x: number, y0: number): number {
    return params.m * x + params.b - y0;
  }

  /**
   * 이등변 삼각형: 꼭짓점 기준 좌/우 다른 기울기
   */
  private calcIsoTri(params: IsoTriParams, x: number, y0: number): number {
    const { xc, ml, bl, mr, br } = params;
    if (x <= xc) {
      return ml * x + bl - y0;
    } else {
      return mr * x + br - y0;
    }
  }

  /**
   * 원: (x-xc)² + (y-yc)² = R²
   * 상단 호 사용: y = yc + √(R² - (x-xc)²)
   */
  private calcCircle(params: CircleParams, x: number, y0: number): number {
    const { xc, yc, R } = params;
    const dx = x - xc;
    const discriminant = R * R - dx * dx;

    if (discriminant < 0) {
      // x가 원의 범위를 벗어남
      return 0;
    }

    // 상단 호 (양의 제곱근)
    const y = yc + Math.sqrt(discriminant);
    return y - y0;
  }

  /**
   * 다각형: 선형 보간
   */
  private calcPolygon(params: PolygonParams, x: number, y0: number): number {
    const { points } = params;
    if (points.length < 2) {
      throw new ShapeDividerError('INVALID_PARAMS', '다각형은 최소 2개의 점이 필요합니다.');
    }

    // x 좌표 기준 정렬된 점들
    const sortedPoints = [...points].sort((a, b) => a[0] - b[0]);

    // x가 범위를 벗어나면 경계값 사용
    if (x <= sortedPoints[0][0]) {
      return sortedPoints[0][1] - y0;
    }
    if (x >= sortedPoints[sortedPoints.length - 1][0]) {
      return sortedPoints[sortedPoints.length - 1][1] - y0;
    }

    // 선형 보간
    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const [x1, y1] = sortedPoints[i];
      const [x2, y2] = sortedPoints[i + 1];

      if (x >= x1 && x <= x2) {
        const t = (x - x1) / (x2 - x1);
        const y = y1 + t * (y2 - y1);
        return y - y0;
      }
    }

    return 0;
  }

  /**
   * 입력 유효성 검증
   */
  private validate(input: ShapeDividerInput): void {
    const { mode, params } = input;

    if (params.L <= 0) {
      throw new ShapeDividerError('NEGATIVE_LENGTH', '길이(L)는 양수여야 합니다.');
    }

    if (mode === 'interval') {
      if (!params.s || params.s <= 0) {
        throw new ShapeDividerError('INVALID_PARAMS', '간격(s)은 양수여야 합니다.');
      }
    } else if (mode === 'equal') {
      if (!params.n || params.n <= 0) {
        throw new ShapeDividerError('ZERO_DIVISIONS', '분할 수(n)는 양수여야 합니다.');
      }
    } else {
      throw new ShapeDividerError('INVALID_MODE', '유효하지 않은 모드입니다.');
    }
  }

  /**
   * 반올림 유틸리티
   */
  private round(value: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }
}

// 싱글톤 인스턴스
export const shapeDividerSolver = new ShapeDividerSolver();
