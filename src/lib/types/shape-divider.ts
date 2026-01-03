// 형상 분할 계산기 타입 정의

// 분할 모드
export type DivisionMode = 'interval' | 'equal';

// 나머지 처리 정책
export type RemainderPolicy = 'uniform' | 'last' | 'spread';

// 형상 타입
export type ShapeType = 'rect' | 'tri_line' | 'iso_tri' | 'circle' | 'polygon';

// 형상별 파라미터
export interface RectParams {
  H: number; // 높이
}

export interface TriLineParams {
  m: number; // 기울기
  b: number; // y절편
}

export interface IsoTriParams {
  xc: number;  // 꼭짓점 x좌표
  ml: number;  // 왼쪽 기울기
  bl: number;  // 왼쪽 y절편
  mr: number;  // 오른쪽 기울기
  br: number;  // 오른쪽 y절편
}

export interface CircleParams {
  xc: number; // 중심 x
  yc: number; // 중심 y
  R: number;  // 반지름
}

export interface PolygonParams {
  points: [number, number][]; // [[x1,y1], [x2,y2], ...]
}

export type ShapeParams = RectParams | TriLineParams | IsoTriParams | CircleParams | PolygonParams;

// 형상 정의
export type ShapeDefinition =
  | { type: 'rect'; params: RectParams }
  | { type: 'tri_line'; params: TriLineParams }
  | { type: 'iso_tri'; params: IsoTriParams }
  | { type: 'circle'; params: CircleParams }
  | { type: 'polygon'; params: PolygonParams };

// 계산 파라미터
export interface DivisionParams {
  L: number;              // 전체 길이
  s?: number;             // mode=interval일 때 간격
  n?: number;             // mode=equal일 때 분할 수
  y0?: number;            // 기준 높이 (기본 0)
  precision?: number;     // 소수점 자릿수 (기본 2)
  remainderPolicy?: RemainderPolicy;
  clampNegativeHeight?: boolean; // 음수 높이 0으로 처리
}

// 입력 전체 구조
export interface ShapeDividerInput {
  mode: DivisionMode;
  options?: {
    height?: boolean;  // 높이 계산 활성화
    mirror?: boolean;  // 좌우 대칭
  };
  shape: ShapeDefinition;
  params: DivisionParams;
}

// 결과 행
export interface DivisionRow {
  i: number;            // 인덱스
  x: number;            // x 좌표
  h: number;            // 높이
  dh: number | null;    // 이전 대비 높이 차이 (첫 번째는 null)
  theta: number | null; // 각도 (도 단위, 첫 번째는 null)
  slopePct: number | null; // 경사율 % (첫 번째는 null)
}

// 결과 구조
export interface ShapeDividerResult {
  n: number;           // 실제 분할 수
  step: number;        // 실제 간격
  remainder: number;   // 나머지 길이
  rows: DivisionRow[];
}

// 에러 타입
export type ShapeDividerErrorCode =
  | 'INVALID_SHAPE'
  | 'INVALID_PARAMS'
  | 'INVALID_MODE'
  | 'NEGATIVE_LENGTH'
  | 'ZERO_DIVISIONS';

export class ShapeDividerError extends Error {
  constructor(
    public code: ShapeDividerErrorCode,
    message: string
  ) {
    super(message);
    this.name = 'ShapeDividerError';
  }
}
