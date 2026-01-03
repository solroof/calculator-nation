import type { CapitalGainsTaxInput, CapitalGainsTaxResult } from '../types/capital-gains-tax';
import { CAPITAL_GAINS_TAX_2024 } from '../types/capital-gains-tax';

export class CapitalGainsTaxCalculator {
  calculate(input: CapitalGainsTaxInput): CapitalGainsTaxResult {
    const {
      propertyType,
      acquisitionPrice,
      sellingPrice,
      acquisitionDate,
      sellingDate,
      expenses = 0,
      houseCount = 1,
      isRegulatedArea = false,
      residenceYears = 0,
      isOneHouseExemption = false,
    } = input;

    // 보유 기간 계산
    const holdingPeriod = this.calculateHoldingPeriod(acquisitionDate, sellingDate);

    // 양도차익 = 양도가액 - 취득가액 - 필요경비
    let capitalGain = sellingPrice - acquisitionPrice - expenses;
    capitalGain = Math.max(0, capitalGain);

    const breakdown: CapitalGainsTaxResult['breakdown'] = [
      { label: '양도가액', amount: sellingPrice },
      { label: '취득가액', amount: -acquisitionPrice },
      { label: '필요경비', amount: -expenses },
      { label: '양도차익', amount: capitalGain },
    ];

    // 1세대 1주택 비과세 체크
    let taxableGain = capitalGain;
    const isHousing = propertyType === 'house' || propertyType === 'apartment';

    if (isOneHouseExemption && isHousing && houseCount === 1) {
      if (sellingPrice <= CAPITAL_GAINS_TAX_2024.oneHouseExemption) {
        // 12억 이하: 전액 비과세
        return this.createExemptResult(capitalGain, holdingPeriod);
      } else {
        // 12억 초과: 초과분만 과세
        const exemptRatio = CAPITAL_GAINS_TAX_2024.oneHouseExemption / sellingPrice;
        taxableGain = Math.floor(capitalGain * (1 - exemptRatio));
      }
    }

    breakdown.push({ label: '과세대상 양도차익', amount: taxableGain });

    // 장기보유특별공제 계산
    let longTermDeductionRate = 0;
    if (holdingPeriod.years >= 2) {
      longTermDeductionRate = this.calculateLongTermDeductionRate(
        holdingPeriod.years,
        residenceYears,
        isOneHouseExemption && houseCount === 1,
        isHousing
      );
    }
    const longTermDeduction = Math.floor(taxableGain * longTermDeductionRate);

    breakdown.push({
      label: `장기보유특별공제 (${(longTermDeductionRate * 100).toFixed(0)}%)`,
      amount: -longTermDeduction
    });

    // 양도소득금액
    const taxableIncome = taxableGain - longTermDeduction;
    breakdown.push({ label: '양도소득금액', amount: taxableIncome });

    // 기본공제
    const basicDeduction = Math.min(taxableIncome, CAPITAL_GAINS_TAX_2024.basicDeduction);
    breakdown.push({ label: '기본공제', amount: -basicDeduction });

    // 과세표준
    const taxBase = Math.max(0, taxableIncome - basicDeduction);
    breakdown.push({ label: '과세표준', amount: taxBase });

    // 세율 및 산출세액 계산
    const appliedRate = this.getAppliedRate(
      holdingPeriod.years,
      isHousing,
      houseCount,
      isRegulatedArea
    );

    let calculatedTax: number;
    let additionalTax = 0;

    if (appliedRate.isShortTerm || appliedRate.isMidTerm) {
      // 단기/중기 양도: 단일 세율 적용
      calculatedTax = Math.floor(taxBase * appliedRate.rate);
    } else {
      // 장기 양도: 누진세율 적용
      calculatedTax = this.calculateProgressiveTax(taxBase);

      // 다주택 중과
      if (isHousing && isRegulatedArea && houseCount >= 2) {
        const surchargeRate = houseCount >= 3
          ? CAPITAL_GAINS_TAX_2024.multiHouseSurcharge.threeOrMore
          : CAPITAL_GAINS_TAX_2024.multiHouseSurcharge.twoHouse;
        additionalTax = Math.floor(taxBase * surchargeRate);
      }
    }

    breakdown.push({ label: '산출세액', amount: calculatedTax });
    if (additionalTax > 0) {
      breakdown.push({ label: '다주택 중과세', amount: additionalTax });
    }

    const capitalGainsTax = calculatedTax + additionalTax;
    const localIncomeTax = Math.floor(capitalGainsTax * CAPITAL_GAINS_TAX_2024.localIncomeTax);
    const totalTax = capitalGainsTax + localIncomeTax;

    breakdown.push({ label: '지방소득세 (10%)', amount: localIncomeTax });
    breakdown.push({ label: '총 납부세액', amount: totalTax });

    const effectiveRate = capitalGain > 0 ? totalTax / capitalGain : 0;

    return {
      capitalGain,
      taxableGain,
      longTermDeduction,
      taxableIncome,
      basicDeduction,
      taxBase,
      calculatedTax,
      additionalTax,
      capitalGainsTax,
      localIncomeTax,
      totalTax,
      effectiveRate,
      holdingPeriod,
      appliedRate: {
        rate: appliedRate.rate,
        description: appliedRate.description,
      },
      breakdown,
    };
  }

  private calculateHoldingPeriod(acquisitionDate: string, sellingDate: string) {
    const acq = new Date(acquisitionDate);
    const sell = new Date(sellingDate);
    const diffMs = sell.getTime() - acq.getTime();
    const totalMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return { years, months, totalMonths };
  }

  private calculateLongTermDeductionRate(
    holdingYears: number,
    residenceYears: number,
    isOneHouse: boolean,
    isHousing: boolean
  ): number {
    if (!isHousing || holdingYears < 2) return 0;

    const { longTermDeduction } = CAPITAL_GAINS_TAX_2024;

    if (isOneHouse && residenceYears >= 2) {
      // 1세대 1주택 2년 이상 거주
      const holdingRate = Math.min(holdingYears, 10) * longTermDeduction.oneHouseResident.holdingRate;
      const residenceRate = Math.min(residenceYears, 10) * longTermDeduction.oneHouseResident.residenceRate;
      return Math.min(holdingRate + residenceRate, longTermDeduction.oneHouseResident.maxRate);
    }

    // 일반 장기보유특별공제
    const rate = Math.min(holdingYears, longTermDeduction.general.maxYears) * longTermDeduction.general.rate;
    return Math.min(rate, longTermDeduction.general.maxRate);
  }

  private getAppliedRate(
    holdingYears: number,
    isHousing: boolean,
    houseCount: number,
    isRegulatedArea: boolean
  ): { rate: number; description: string; isShortTerm: boolean; isMidTerm: boolean } {
    const { shortTerm, midTerm } = CAPITAL_GAINS_TAX_2024;

    // 1년 미만: 단기 양도
    if (holdingYears < 1) {
      const rate = isHousing ? shortTerm.house : shortTerm.other;
      return {
        rate,
        description: `단기양도 (1년 미만) ${Math.round(rate * 100)}%`,
        isShortTerm: true,
        isMidTerm: false,
      };
    }

    // 1~2년: 중기 양도
    if (holdingYears < 2) {
      return {
        rate: midTerm,
        description: `중기양도 (1~2년) ${Math.round(midTerm * 100)}%`,
        isShortTerm: false,
        isMidTerm: true,
      };
    }

    // 2년 이상: 기본세율 (다주택 중과는 별도 처리)
    let description = '기본세율 (6~45%)';
    if (isHousing && isRegulatedArea && houseCount >= 2) {
      const surcharge = houseCount >= 3 ? 30 : 20;
      description = `기본세율 + ${surcharge}%p 중과`;
    }

    return {
      rate: 0, // 누진세율이므로 단일 rate 없음
      description,
      isShortTerm: false,
      isMidTerm: false,
    };
  }

  private calculateProgressiveTax(taxBase: number): number {
    const { taxBrackets } = CAPITAL_GAINS_TAX_2024;

    for (const bracket of taxBrackets) {
      if (taxBase <= bracket.max) {
        return Math.floor(taxBase * bracket.rate - bracket.deduction);
      }
    }

    // 최고 세율 적용
    const lastBracket = taxBrackets[taxBrackets.length - 1];
    return Math.floor(taxBase * lastBracket.rate - lastBracket.deduction);
  }

  private createExemptResult(
    capitalGain: number,
    holdingPeriod: CapitalGainsTaxResult['holdingPeriod']
  ): CapitalGainsTaxResult {
    return {
      capitalGain,
      taxableGain: 0,
      longTermDeduction: 0,
      taxableIncome: 0,
      basicDeduction: 0,
      taxBase: 0,
      calculatedTax: 0,
      additionalTax: 0,
      capitalGainsTax: 0,
      localIncomeTax: 0,
      totalTax: 0,
      effectiveRate: 0,
      holdingPeriod,
      appliedRate: {
        rate: 0,
        description: '1세대 1주택 비과세',
      },
      breakdown: [
        { label: '양도차익', amount: capitalGain },
        { label: '비과세 (1세대 1주택)', amount: 0 },
      ],
    };
  }
}

export const capitalGainsTaxCalculator = new CapitalGainsTaxCalculator();
