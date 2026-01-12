import type {
  TriangleInput,
  TriangleResult,
  SSAResult,
  SolveResult,
  InputType,
  TriangleType,
  Vertices,
  Heights,
} from '../types/triangle';
import { TriangleError } from '../types/triangle';

// 유틸리티 함수
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const EPSILON = 1e-10;

export function degToRad(deg: number): number {
  return deg * DEG_TO_RAD;
}

export function radToDeg(rad: number): number {
  return rad * RAD_TO_DEG;
}

function isClose(a: number, b: number, tolerance = EPSILON): boolean {
  return Math.abs(a - b) < tolerance;
}

export class TriangleSolver {
  private precision: number;

  constructor(precision = 4) {
    this.precision = precision;
  }

  /**
   * 메인 솔버: 입력에 따라 적절한 알고리즘 선택
   */
  solve(input: TriangleInput): SolveResult {
    // 1. 각도 단위 변환 (deg -> rad)
    const normalizedInput = this.normalizeInput(input);

    // 2. 입력 조합 감지
    const type = this.detectInputType(normalizedInput);

    // 3. 유효성 검증
    this.validate(normalizedInput, type);

    // 4. 알고리즘 분기
    switch (type) {
      case 'SSS':
        return this.solveSSS(normalizedInput);
      case 'SAS':
        return this.solveSAS(normalizedInput);
      case 'ASA':
        return this.solveASA(normalizedInput);
      case 'AAS':
        return this.solveAAS(normalizedInput);
      case 'RHS':
        return this.solveRHS(normalizedInput);
      case 'SSA':
        return this.solveSSA(normalizedInput);
      default:
        throw new TriangleError('INVALID_COMBINATION', '유효한 입력 조합이 아닙니다.');
    }
  }

  /**
   * 입력 정규화: 각도를 라디안으로 변환
   */
  private normalizeInput(input: TriangleInput): TriangleInput {
    const unit = input.unit?.angle ?? 'deg';
    const normalized = { ...input };

    if (unit === 'deg') {
      if (normalized.A !== undefined) normalized.A = degToRad(normalized.A);
      if (normalized.B !== undefined) normalized.B = degToRad(normalized.B);
      if (normalized.C !== undefined) normalized.C = degToRad(normalized.C);
    }

    // 직각(90°) 자동 감지 및 rightAngleAt 설정
    const rightAngle = Math.PI / 2;
    if (!normalized.rightAngleAt) {
      if (normalized.C !== undefined && isClose(normalized.C, rightAngle)) {
        normalized.rightAngleAt = 'C';
      } else if (normalized.A !== undefined && isClose(normalized.A, rightAngle)) {
        normalized.rightAngleAt = 'A';
      } else if (normalized.B !== undefined && isClose(normalized.B, rightAngle)) {
        normalized.rightAngleAt = 'B';
      }
    }

    return normalized;
  }

  /**
   * 입력 조합 감지
   */
  private detectInputType(input: TriangleInput): InputType {
    const sides = [input.a, input.b, input.c].filter((v) => v !== undefined).length;
    const angles = [input.A, input.B, input.C].filter((v) => v !== undefined).length;

    // 직각삼각형 특수 케이스
    if (input.rightAngleAt && sides === 2) {
      return 'RHS';
    }

    if (sides === 3 && angles === 0) return 'SSS';
    if (sides === 2 && angles === 1) {
      // SAS vs SSA 구분: 끼인각인지 확인
      if (this.isIncludedAngle(input)) return 'SAS';
      return 'SSA';
    }
    if (sides === 1 && angles === 2) return 'AAS';
    if (sides === 2 && angles === 2) {
      // 이 경우도 가능 (하나가 끼인각이면 SAS로 처리 가능)
      if (this.isIncludedAngle(input)) return 'SAS';
      return 'ASA';
    }
    if (sides === 1 && angles === 2) {
      // ASA vs AAS 구분
      return this.isASA(input) ? 'ASA' : 'AAS';
    }

    throw new TriangleError('INSUFFICIENT_INPUT', '삼각형을 결정하기에 입력이 부족합니다.');
  }

  /**
   * 끼인각 여부 확인
   */
  private isIncludedAngle(input: TriangleInput): boolean {
    // 각 C가 주어지고 a, b가 주어진 경우 -> C는 a, b의 끼인각
    if (input.C !== undefined && input.a !== undefined && input.b !== undefined) return true;
    if (input.A !== undefined && input.b !== undefined && input.c !== undefined) return true;
    if (input.B !== undefined && input.a !== undefined && input.c !== undefined) return true;
    return false;
  }

  /**
   * ASA 여부 확인
   */
  private isASA(input: TriangleInput): boolean {
    // 한 변과 양 끝 각이 주어진 경우
    if (input.a !== undefined && input.B !== undefined && input.C !== undefined) return true;
    if (input.b !== undefined && input.A !== undefined && input.C !== undefined) return true;
    if (input.c !== undefined && input.A !== undefined && input.B !== undefined) return true;
    return false;
  }

  /**
   * 유효성 검증
   */
  private validate(input: TriangleInput, type: InputType): void {
    // 음수/0 체크
    const values = [input.a, input.b, input.c, input.A, input.B, input.C].filter(
      (v) => v !== undefined
    ) as number[];

    for (const v of values) {
      if (v < 0) throw new TriangleError('NEGATIVE_VALUE', '값은 음수일 수 없습니다.');
      if (v === 0) throw new TriangleError('ZERO_VALUE', '값은 0일 수 없습니다.');
    }

    // 각도 합 체크
    const angleSum = (input.A ?? 0) + (input.B ?? 0) + (input.C ?? 0);
    if (angleSum > Math.PI + EPSILON) {
      throw new TriangleError('ANGLE_SUM_EXCEEDED', '각의 합이 180도를 초과합니다.');
    }

    // SSS의 경우 삼각부등식 체크
    if (type === 'SSS') {
      const { a, b, c } = input as { a: number; b: number; c: number };
      if (a + b <= c || b + c <= a || c + a <= b) {
        throw new TriangleError('TRIANGLE_INEQUALITY', '삼각부등식을 만족하지 않습니다.');
      }
    }
  }

  /**
   * SSS: 세 변으로 삼각형 계산
   */
  private solveSSS(input: TriangleInput): TriangleResult {
    const { a, b, c } = input as { a: number; b: number; c: number };
    const steps: string[] = [];

    // 코사인 법칙으로 각도 계산
    const C = Math.acos((a * a + b * b - c * c) / (2 * a * b));
    steps.push(`코사인 법칙: C = arccos((a² + b² - c²) / 2ab) = ${radToDeg(C).toFixed(2)}°`);

    const A = Math.acos((b * b + c * c - a * a) / (2 * b * c));
    steps.push(`코사인 법칙: A = arccos((b² + c² - a²) / 2bc) = ${radToDeg(A).toFixed(2)}°`);

    const B = Math.PI - A - C;
    steps.push(`B = 180° - A - C = ${radToDeg(B).toFixed(2)}°`);

    // 헤론 공식으로 면적 계산
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    steps.push(`헤론 공식: S = √[s(s-a)(s-b)(s-c)] = ${area.toFixed(2)}`);

    return this.buildResult({ a, b, c, A, B, C, area, inputType: 'SSS', steps });
  }

  /**
   * SAS: 두 변과 끼인각으로 삼각형 계산
   */
  private solveSAS(input: TriangleInput): TriangleResult {
    const steps: string[] = [];
    let a: number, b: number, c: number, A: number, B: number, C: number;

    // 입력 패턴에 따라 변수 할당
    if (input.C !== undefined && input.a !== undefined && input.b !== undefined) {
      a = input.a;
      b = input.b;
      C = input.C;
      // 코사인 법칙으로 c 계산
      c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C));
      steps.push(`코사인 법칙: c = √(a² + b² - 2ab·cosC) = ${c.toFixed(2)}`);
      // 나머지 각도 계산
      A = Math.acos((b * b + c * c - a * a) / (2 * b * c));
      B = Math.PI - A - C;
      steps.push(`코사인 법칙: A = arccos((b² + c² - a²) / 2bc) = ${radToDeg(A).toFixed(2)}°`);
      steps.push(`내각의 합: B = 180° - A - C = ${radToDeg(B).toFixed(2)}°`);
    } else if (input.A !== undefined && input.b !== undefined && input.c !== undefined) {
      b = input.b;
      c = input.c;
      A = input.A;
      a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(A));
      steps.push(`코사인 법칙: a = √(b² + c² - 2bc·cosA) = ${a.toFixed(2)}`);
      // 나머지 각도 계산
      B = Math.acos((a * a + c * c - b * b) / (2 * a * c));
      C = Math.PI - A - B;
      steps.push(`코사인 법칙: B = arccos((a² + c² - b²) / 2ac) = ${radToDeg(B).toFixed(2)}°`);
      steps.push(`내각의 합: C = 180° - A - B = ${radToDeg(C).toFixed(2)}°`);
    } else if (input.B !== undefined && input.a !== undefined && input.c !== undefined) {
      a = input.a;
      c = input.c;
      B = input.B!;
      b = Math.sqrt(a * a + c * c - 2 * a * c * Math.cos(B));
      steps.push(`코사인 법칙: b = √(a² + c² - 2ac·cosB) = ${b.toFixed(2)}`);
      // 나머지 각도 계산
      A = Math.acos((b * b + c * c - a * a) / (2 * b * c));
      C = Math.PI - A - B;
      steps.push(`코사인 법칙: A = arccos((b² + c² - a²) / 2bc) = ${radToDeg(A).toFixed(2)}°`);
      steps.push(`내각의 합: C = 180° - A - B = ${radToDeg(C).toFixed(2)}°`);
    } else {
      throw new TriangleError('INVALID_COMBINATION', 'SAS 입력이 올바르지 않습니다.');
    }

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    steps.push(`헤론 공식: 넓이 = √[s(s-a)(s-b)(s-c)] = ${area.toFixed(2)}`);

    return this.buildResult({ a, b, c, A, B, C, area, inputType: 'SAS', steps });
  }

  /**
   * ASA: 한 변과 양 끝 각으로 삼각형 계산
   */
  private solveASA(input: TriangleInput): TriangleResult {
    const steps: string[] = [];
    let a: number, b: number, c: number, A: number, B: number, C: number;

    if (input.c !== undefined && input.A !== undefined && input.B !== undefined) {
      c = input.c;
      A = input.A;
      B = input.B;
      C = Math.PI - A - B;
      steps.push(`내각의 합: C = 180° - A - B = ${radToDeg(C).toFixed(2)}°`);
      // 사인 법칙
      a = (c * Math.sin(A)) / Math.sin(C);
      b = (c * Math.sin(B)) / Math.sin(C);
      steps.push(`사인 법칙: a = c·sinA/sinC = ${a.toFixed(2)}`);
      steps.push(`사인 법칙: b = c·sinB/sinC = ${b.toFixed(2)}`);
    } else if (input.a !== undefined && input.B !== undefined && input.C !== undefined) {
      a = input.a;
      B = input.B;
      C = input.C;
      A = Math.PI - B - C;
      steps.push(`내각의 합: A = 180° - B - C = ${radToDeg(A).toFixed(2)}°`);
      b = (a * Math.sin(B)) / Math.sin(A);
      c = (a * Math.sin(C)) / Math.sin(A);
      steps.push(`사인 법칙: b = a·sinB/sinA = ${b.toFixed(2)}`);
      steps.push(`사인 법칙: c = a·sinC/sinA = ${c.toFixed(2)}`);
    } else if (input.b !== undefined && input.A !== undefined && input.C !== undefined) {
      b = input.b;
      A = input.A;
      C = input.C;
      B = Math.PI - A - C;
      steps.push(`내각의 합: B = 180° - A - C = ${radToDeg(B).toFixed(2)}°`);
      a = (b * Math.sin(A)) / Math.sin(B);
      c = (b * Math.sin(C)) / Math.sin(B);
      steps.push(`사인 법칙: a = b·sinA/sinB = ${a.toFixed(2)}`);
      steps.push(`사인 법칙: c = b·sinC/sinB = ${c.toFixed(2)}`);
    } else {
      throw new TriangleError('INVALID_COMBINATION', 'ASA 입력이 올바르지 않습니다.');
    }

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    steps.push(`헤론 공식: 넓이 = √[s(s-a)(s-b)(s-c)] = ${area.toFixed(2)}`);

    return this.buildResult({ a, b, c, A, B, C, area, inputType: 'ASA', steps });
  }

  /**
   * AAS: 두 각과 한 변으로 삼각형 계산
   */
  private solveAAS(input: TriangleInput): TriangleResult {
    const steps: string[] = [];
    let a: number, b: number, c: number, A: number, B: number, C: number;

    // 가능한 모든 AAS 조합 처리
    if (input.a !== undefined && input.A !== undefined && input.C !== undefined) {
      a = input.a;
      A = input.A;
      C = input.C;
      B = Math.PI - A - C;
      steps.push(`내각의 합: B = 180° - A - C = ${radToDeg(B).toFixed(2)}°`);
      b = (a * Math.sin(B)) / Math.sin(A);
      c = (a * Math.sin(C)) / Math.sin(A);
      steps.push(`사인 법칙: b = a·sinB/sinA = ${b.toFixed(2)}`);
      steps.push(`사인 법칙: c = a·sinC/sinA = ${c.toFixed(2)}`);
    } else if (input.a !== undefined && input.A !== undefined && input.B !== undefined) {
      a = input.a;
      A = input.A;
      B = input.B;
      C = Math.PI - A - B;
      steps.push(`내각의 합: C = 180° - A - B = ${radToDeg(C).toFixed(2)}°`);
      b = (a * Math.sin(B)) / Math.sin(A);
      c = (a * Math.sin(C)) / Math.sin(A);
      steps.push(`사인 법칙: b = a·sinB/sinA = ${b.toFixed(2)}`);
      steps.push(`사인 법칙: c = a·sinC/sinA = ${c.toFixed(2)}`);
    } else if (input.b !== undefined && input.A !== undefined && input.B !== undefined) {
      b = input.b;
      A = input.A;
      B = input.B;
      C = Math.PI - A - B;
      steps.push(`내각의 합: C = 180° - A - B = ${radToDeg(C).toFixed(2)}°`);
      a = (b * Math.sin(A)) / Math.sin(B);
      c = (b * Math.sin(C)) / Math.sin(B);
      steps.push(`사인 법칙: a = b·sinA/sinB = ${a.toFixed(2)}`);
      steps.push(`사인 법칙: c = b·sinC/sinB = ${c.toFixed(2)}`);
    } else if (input.b !== undefined && input.B !== undefined && input.C !== undefined) {
      b = input.b;
      B = input.B;
      C = input.C;
      A = Math.PI - B - C;
      steps.push(`내각의 합: A = 180° - B - C = ${radToDeg(A).toFixed(2)}°`);
      a = (b * Math.sin(A)) / Math.sin(B);
      c = (b * Math.sin(C)) / Math.sin(B);
      steps.push(`사인 법칙: a = b·sinA/sinB = ${a.toFixed(2)}`);
      steps.push(`사인 법칙: c = b·sinC/sinB = ${c.toFixed(2)}`);
    } else if (input.c !== undefined && input.A !== undefined && input.C !== undefined) {
      c = input.c;
      A = input.A;
      C = input.C;
      B = Math.PI - A - C;
      steps.push(`내각의 합: B = 180° - A - C = ${radToDeg(B).toFixed(2)}°`);
      a = (c * Math.sin(A)) / Math.sin(C);
      b = (c * Math.sin(B)) / Math.sin(C);
      steps.push(`사인 법칙: a = c·sinA/sinC = ${a.toFixed(2)}`);
      steps.push(`사인 법칙: b = c·sinB/sinC = ${b.toFixed(2)}`);
    } else if (input.c !== undefined && input.B !== undefined && input.C !== undefined) {
      c = input.c;
      B = input.B;
      C = input.C;
      A = Math.PI - B - C;
      steps.push(`내각의 합: A = 180° - B - C = ${radToDeg(A).toFixed(2)}°`);
      a = (c * Math.sin(A)) / Math.sin(C);
      b = (c * Math.sin(B)) / Math.sin(C);
      steps.push(`사인 법칙: a = c·sinA/sinC = ${a.toFixed(2)}`);
      steps.push(`사인 법칙: b = c·sinB/sinC = ${b.toFixed(2)}`);
    } else {
      // ASA 케이스로 폴백
      return this.solveASA(input);
    }

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    steps.push(`헤론 공식: 넓이 = √[s(s-a)(s-b)(s-c)] = ${area.toFixed(2)}`);

    return this.buildResult({ a, b, c, A, B, C, area, inputType: 'AAS', steps });
  }

  /**
   * RHS: 직각삼각형 (빗변 + 한 변)
   */
  private solveRHS(input: TriangleInput): TriangleResult {
    const steps: string[] = [];
    const rightAngle = Math.PI / 2;
    let a: number, b: number, c: number, A: number, B: number, C: number;

    // 직각 위치에 따라 처리
    const rightAt = input.rightAngleAt!;

    if (rightAt === 'C') {
      C = rightAngle;
      if (input.c !== undefined && input.a !== undefined) {
        c = input.c; // 빗변
        a = input.a;
        // 빗변이 다른 변보다 길어야 함
        if (c <= a) {
          throw new TriangleError('INVALID_COMBINATION', '빗변(c)은 다른 변(a)보다 커야 합니다.');
        }
        b = Math.sqrt(c * c - a * a);
        steps.push(`피타고라스: b = √(c² - a²) = ${b.toFixed(2)}`);
      } else if (input.c !== undefined && input.b !== undefined) {
        c = input.c;
        b = input.b;
        // 빗변이 다른 변보다 길어야 함
        if (c <= b) {
          throw new TriangleError('INVALID_COMBINATION', '빗변(c)은 다른 변(b)보다 커야 합니다.');
        }
        a = Math.sqrt(c * c - b * b);
        steps.push(`피타고라스: a = √(c² - b²) = ${a.toFixed(2)}`);
      } else if (input.a !== undefined && input.b !== undefined) {
        a = input.a;
        b = input.b;
        c = Math.sqrt(a * a + b * b);
        steps.push(`피타고라스: c = √(a² + b²) = ${c.toFixed(2)}`);
      } else {
        throw new TriangleError('INVALID_COMBINATION', 'RHS 입력이 올바르지 않습니다.');
      }
      A = Math.atan(a / b);
      B = Math.PI / 2 - A;
      steps.push(`삼각비: A = arctan(a/b) = arctan(${a.toFixed(2)}/${b.toFixed(2)}) = ${radToDeg(A).toFixed(2)}°`);
      steps.push(`직각삼각형: B = 90° - A = ${radToDeg(B).toFixed(2)}°`);
    } else {
      // A나 B가 직각인 경우도 유사하게 처리
      throw new TriangleError('INVALID_COMBINATION', '현재 C가 직각인 경우만 지원합니다.');
    }

    const area = (a * b) / 2;
    steps.push(`면적 = (1/2)·a·b = ${area.toFixed(2)}`);

    return this.buildResult({ a, b, c, A, B, C, area, inputType: 'RHS', steps });
  }

  /**
   * SSA: 두 변과 대응하지 않는 각 (모호한 경우)
   */
  private solveSSA(input: TriangleInput): SSAResult {
    const baseSteps: string[] = [];

    // a, b, A가 주어진 경우로 정규화
    let a: number, b: number, A: number;

    if (input.a !== undefined && input.b !== undefined && input.A !== undefined) {
      a = input.a;
      b = input.b;
      A = input.A;
    } else if (input.b !== undefined && input.c !== undefined && input.B !== undefined) {
      a = input.b;
      b = input.c;
      A = input.B;
    } else if (input.a !== undefined && input.c !== undefined && input.C !== undefined) {
      a = input.c;
      b = input.a;
      A = input.C;
    } else {
      throw new TriangleError('INVALID_COMBINATION', 'SSA 입력이 올바르지 않습니다.');
    }

    const h = b * Math.sin(A);
    baseSteps.push(`기준 높이: h = b·sin(A) = ${b.toFixed(2)}·sin(${radToDeg(A).toFixed(2)}°) = ${h.toFixed(2)}`);

    // 해의 개수 판정
    if (a < h - EPSILON) {
      return {
        solutionCount: 0,
        solutions: [],
        reason: `a(${a.toFixed(2)}) < h(${h.toFixed(2)}): 삼각형을 만들 수 없습니다.`,
      };
    }

    if (isClose(a, h)) {
      // 정확히 1개 해 (직각삼각형)
      const B = Math.PI / 2;
      const C = Math.PI - A - B;
      const c = b * Math.cos(A);
      const area = (a * c) / 2;
      const steps = [...baseSteps];
      steps.push(`a = h 이므로 직각삼각형: B = 90°`);
      steps.push(`내각의 합: C = 180° - A - B = ${radToDeg(C).toFixed(2)}°`);
      steps.push(`삼각비: c = b·cos(A) = ${c.toFixed(2)}`);
      steps.push(`면적 = (1/2)·a·c = ${area.toFixed(2)}`);

      return {
        solutionCount: 1,
        solutions: [this.buildResult({ a, b, c, A, B, C, area, inputType: 'SSA', steps })],
        reason: 'a = h: 직각삼각형 1개',
      };
    }

    if (a < b) {
      // 2개 해 가능
      const sinB = (b * Math.sin(A)) / a;

      if (sinB > 1) {
        return {
          solutionCount: 0,
          solutions: [],
          reason: 'sinB > 1: 삼각형을 만들 수 없습니다.',
        };
      }

      const B1 = Math.asin(sinB); // 예각
      const B2 = Math.PI - B1;    // 둔각

      const solutions: TriangleResult[] = [];

      // 첫 번째 해 (예각)
      const C1 = Math.PI - A - B1;
      if (C1 > 0) {
        const c1 = (a * Math.sin(C1)) / Math.sin(A);
        const s1 = (a + b + c1) / 2;
        const area1 = Math.sqrt(s1 * (s1 - a) * (s1 - b) * (s1 - c1));
        const steps1 = [...baseSteps];
        steps1.push(`사인 법칙: sin(B) = b·sin(A)/a = ${sinB.toFixed(4)}`);
        steps1.push(`B(예각) = arcsin(${sinB.toFixed(4)}) = ${radToDeg(B1).toFixed(2)}°`);
        steps1.push(`내각의 합: C = 180° - A - B = ${radToDeg(C1).toFixed(2)}°`);
        steps1.push(`사인 법칙: c = a·sin(C)/sin(A) = ${c1.toFixed(2)}`);
        steps1.push(`헤론 공식: 넓이 = ${area1.toFixed(2)}`);
        solutions.push(
          this.buildResult({
            a, b, c: c1, A, B: B1, C: C1, area: area1,
            inputType: 'SSA',
            steps: steps1,
          })
        );
      }

      // 두 번째 해 (둔각)
      const C2 = Math.PI - A - B2;
      if (C2 > 0) {
        const c2 = (a * Math.sin(C2)) / Math.sin(A);
        const s2 = (a + b + c2) / 2;
        const area2 = Math.sqrt(s2 * (s2 - a) * (s2 - b) * (s2 - c2));
        const steps2 = [...baseSteps];
        steps2.push(`사인 법칙: sin(B) = b·sin(A)/a = ${sinB.toFixed(4)}`);
        steps2.push(`B(둔각) = 180° - arcsin(${sinB.toFixed(4)}) = ${radToDeg(B2).toFixed(2)}°`);
        steps2.push(`내각의 합: C = 180° - A - B = ${radToDeg(C2).toFixed(2)}°`);
        steps2.push(`사인 법칙: c = a·sin(C)/sin(A) = ${c2.toFixed(2)}`);
        steps2.push(`헤론 공식: 넓이 = ${area2.toFixed(2)}`);
        solutions.push(
          this.buildResult({
            a, b, c: c2, A, B: B2, C: C2, area: area2,
            inputType: 'SSA',
            steps: steps2,
          })
        );
      }

      return {
        solutionCount: solutions.length as 0 | 1 | 2,
        solutions,
        reason: solutions.length === 2 ? 'h < a < b: 예각/둔각 2개 해' : '1개 해',
      };
    }

    // a >= b: 1개 해
    const sinB = (b * Math.sin(A)) / a;
    const B = Math.asin(sinB);
    const C = Math.PI - A - B;
    const c = (a * Math.sin(C)) / Math.sin(A);
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    const steps = [...baseSteps];
    steps.push(`a ≥ b 이므로 해가 1개`);
    steps.push(`사인 법칙: sin(B) = b·sin(A)/a = ${sinB.toFixed(4)}`);
    steps.push(`B = arcsin(${sinB.toFixed(4)}) = ${radToDeg(B).toFixed(2)}°`);
    steps.push(`내각의 합: C = 180° - A - B = ${radToDeg(C).toFixed(2)}°`);
    steps.push(`사인 법칙: c = a·sin(C)/sin(A) = ${c.toFixed(2)}`);
    steps.push(`헤론 공식: 넓이 = ${area.toFixed(2)}`);

    return {
      solutionCount: 1,
      solutions: [this.buildResult({ a, b, c, A, B, C, area, inputType: 'SSA', steps })],
      reason: 'a ≥ b: 1개 해',
    };
  }

  /**
   * 결과 객체 빌드
   */
  private buildResult(params: {
    a: number;
    b: number;
    c: number;
    A: number;
    B: number;
    C: number;
    area: number;
    inputType: InputType;
    steps: string[];
  }): TriangleResult {
    const { a, b, c, A, B, C, area, inputType, steps } = params;

    const perimeter = a + b + c;
    const s = perimeter / 2;

    // 높이 계산
    const heights: Heights = {
      ha: (2 * area) / a,
      hb: (2 * area) / b,
      hc: (2 * area) / c,
    };

    // 내접원/외접원 반지름
    const inradius = area / s;
    const circumradius = (a * b * c) / (4 * area);

    // 삼각형 유형 판정
    const type = this.classifyTriangle(A, B, C);

    // 좌표 계산 (B를 원점, C를 x축 위에)
    const vertices = this.calculateVertices(a, b, c, A, B, C);

    const warnings: string[] = [];

    return {
      a,
      b,
      c,
      A,
      B,
      C,
      ADeg: radToDeg(A),
      BDeg: radToDeg(B),
      CDeg: radToDeg(C),
      area,
      perimeter,
      heights,
      inradius,
      circumradius,
      vertices,
      type,
      inputType,
      steps,
      warnings,
    };
  }

  /**
   * 삼각형 유형 분류
   */
  private classifyTriangle(A: number, B: number, C: number): TriangleType {
    const rightAngle = Math.PI / 2;
    const angles = [A, B, C];

    if (angles.some((a) => isClose(a, rightAngle))) return 'right';
    if (angles.some((a) => a > rightAngle)) return 'obtuse';
    return 'acute';
  }

  /**
   * 좌표 계산 (시각화용)
   */
  private calculateVertices(
    a: number,
    b: number,
    c: number,
     
    _A: number,
    B: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _C: number
  ): Vertices {
    // B를 원점, C를 x축 양의 방향에 배치
    const Bx = 0,
      By = 0;
    const Cx = a,
      Cy = 0;

    // A는 B에서 각 B만큼 회전한 방향으로 c만큼 떨어진 곳
    const Ax = c * Math.cos(B);
    const Ay = c * Math.sin(B);

    return {
      A: { x: Ax, y: Ay },
      B: { x: Bx, y: By },
      C: { x: Cx, y: Cy },
    };
  }
}

// 싱글톤 인스턴스
export const triangleSolver = new TriangleSolver();
