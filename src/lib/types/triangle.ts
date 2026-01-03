// 삼각형 계산기 타입 정의

export type AngleUnit = 'deg' | 'rad';
export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';

export type InputType = 'SSS' | 'SAS' | 'ASA' | 'AAS' | 'RHS' | 'SSA';
export type TriangleType = 'right' | 'acute' | 'obtuse';
export type VertexName = 'A' | 'B' | 'C';

export interface TriangleInput {
  // 변 (sides)
  a?: number;
  b?: number;
  c?: number;

  // 각 (angles) - 내부적으로는 라디안 사용
  A?: number;
  B?: number;
  C?: number;

  // 특수: 직각삼각형
  rightAngleAt?: VertexName;

  // 설정
  unit?: {
    angle: AngleUnit;
    length: LengthUnit;
  };
  precision?: number; // 소수점 자릿수
}

export interface Point {
  x: number;
  y: number;
}

export interface Heights {
  ha: number;
  hb: number;
  hc: number;
}

export interface Vertices {
  A: Point;
  B: Point;
  C: Point;
}

export interface TriangleResult {
  // 기본 요소
  a: number;
  b: number;
  c: number;
  A: number; // 라디안
  B: number;
  C: number;

  // 각도 (도 단위, 편의용)
  ADeg: number;
  BDeg: number;
  CDeg: number;

  // 계산 결과
  area: number;          // 면적 S
  perimeter: number;     // 둘레 P

  // 고급 속성
  heights: Heights;       // 높이들
  inradius: number;       // 내접원 반지름 r
  circumradius: number;   // 외접원 반지름 R

  // 좌표계 (시각화용)
  vertices: Vertices;

  // 메타 정보
  type: TriangleType;
  inputType: InputType;
  steps: string[];        // 계산 과정 설명
  warnings: string[];     // 경고 메시지
}

export interface SSAResult {
  solutionCount: 0 | 1 | 2;
  solutions: TriangleResult[];
  reason: string;
}

export type SolveResult = TriangleResult | SSAResult;

// 타입 가드
export function isSSAResult(result: SolveResult): result is SSAResult {
  return 'solutionCount' in result;
}

export function isTriangleResult(result: SolveResult): result is TriangleResult {
  return 'area' in result && !('solutionCount' in result);
}

// 에러 타입
export type TriangleErrorCode =
  | 'INVALID_COMBINATION'
  | 'TRIANGLE_INEQUALITY'
  | 'ANGLE_SUM_EXCEEDED'
  | 'NEGATIVE_VALUE'
  | 'ZERO_VALUE'
  | 'INSUFFICIENT_INPUT';

export class TriangleError extends Error {
  constructor(
    public code: TriangleErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'TriangleError';
  }
}
