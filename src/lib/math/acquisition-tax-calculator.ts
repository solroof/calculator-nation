import type { AcquisitionTaxInput, AcquisitionTaxResult } from '../types/acquisition-tax';
import { ACQUISITION_TAX_2024 } from '../types/acquisition-tax';

export class AcquisitionTaxCalculator {
  calculate(input: AcquisitionTaxInput): AcquisitionTaxResult {
    const {
      propertyType,
      acquisitionPrice,
      houseCount = 1,
      isRegulatedArea = false,
      isFirstTimeBuyer = false,
      area = 85,
    } = input;

    let acquisitionTaxRate: number;
    let rateDescription: string;

    // 취득세율 결정
    if (propertyType === 'house' || propertyType === 'apartment') {
      acquisitionTaxRate = this.calculateHouseTaxRate(
        acquisitionPrice,
        houseCount,
        isRegulatedArea,
        isFirstTimeBuyer
      );
      rateDescription = this.getHouseRateDescription(houseCount, isRegulatedArea, acquisitionPrice);
    } else {
      // 비주택 부동산
      acquisitionTaxRate = this.getNonHouseTaxRate(propertyType);
      rateDescription = this.getNonHouseRateDescription(propertyType);
    }

    // 취득세 계산
    const acquisitionTax = Math.floor(acquisitionPrice * acquisitionTaxRate);

    // 지방교육세 (취득세의 10%)
    const localEducationTax = Math.floor(acquisitionTax * ACQUISITION_TAX_2024.localEducationTax);

    // 농어촌특별세 (85㎡ 초과 시 2%, 주택만 해당)
    let ruralSpecialTax = 0;
    if ((propertyType === 'house' || propertyType === 'apartment') && area > 85) {
      ruralSpecialTax = Math.floor(acquisitionPrice * ACQUISITION_TAX_2024.ruralSpecialTax);
    }

    const totalTax = acquisitionTax + localEducationTax + ruralSpecialTax;

    const breakdown: AcquisitionTaxResult['breakdown'] = [
      {
        label: `취득세 (${rateDescription})`,
        rate: acquisitionTaxRate,
        amount: acquisitionTax,
      },
      {
        label: '지방교육세 (취득세의 10%)',
        rate: acquisitionTaxRate * 0.1,
        amount: localEducationTax,
      },
    ];

    if (ruralSpecialTax > 0) {
      breakdown.push({
        label: '농어촌특별세 (85㎡ 초과)',
        rate: ACQUISITION_TAX_2024.ruralSpecialTax,
        amount: ruralSpecialTax,
      });
    }

    return {
      acquisitionTax,
      acquisitionTaxRate,
      localEducationTax,
      ruralSpecialTax,
      totalTax,
      breakdown,
    };
  }

  private calculateHouseTaxRate(
    price: number,
    houseCount: number,
    isRegulatedArea: boolean,
    isFirstTimeBuyer: boolean
  ): number {
    const { house, multiHouse, nonRegulatedMultiHouse } = ACQUISITION_TAX_2024;

    // 생애 최초 주택 구매자 감면 (1.5억 이하 면제, 그 외 50% 감면)
    if (isFirstTimeBuyer && houseCount === 1) {
      if (price <= 150000000) {
        return 0; // 면제
      }
      // 일반 세율의 50% 적용
      return this.getBaseHouseTaxRate(price) * 0.5;
    }

    // 다주택자 중과세율
    if (houseCount >= 3) {
      return isRegulatedArea ? multiHouse.threeOrMore : nonRegulatedMultiHouse.threeOrMore;
    }

    if (houseCount === 2) {
      return isRegulatedArea ? multiHouse.twoHouse : this.getBaseHouseTaxRate(price);
    }

    // 1주택자 일반 세율
    return this.getBaseHouseTaxRate(price);
  }

  private getBaseHouseTaxRate(price: number): number {
    const { house } = ACQUISITION_TAX_2024;

    if (price <= house.under600M.threshold) {
      return house.under600M.rate;
    }

    if (price <= house.between600M900M.maxThreshold) {
      // 6억~9억: 누진세율 (가격에 따라 1%~3% 사이)
      const { minRate, maxRate, minThreshold, maxThreshold } = house.between600M900M;
      const ratio = (price - minThreshold) / (maxThreshold - minThreshold);
      return minRate + ratio * (maxRate - minRate);
    }

    return house.over900M.rate;
  }

  private getNonHouseTaxRate(propertyType: string): number {
    switch (propertyType) {
      case 'land':
        return ACQUISITION_TAX_2024.land;
      case 'commercial':
        return ACQUISITION_TAX_2024.commercial;
      case 'officetel':
        return ACQUISITION_TAX_2024.officetel;
      default:
        return 0.04;
    }
  }

  private getHouseRateDescription(
    houseCount: number,
    isRegulatedArea: boolean,
    price: number
  ): string {
    if (houseCount >= 3) {
      return isRegulatedArea ? '3주택 이상 중과' : '3주택 이상';
    }
    if (houseCount === 2) {
      return isRegulatedArea ? '2주택 중과' : '2주택';
    }

    if (price <= 600000000) return '6억 이하';
    if (price <= 900000000) return '6억~9억 누진';
    return '9억 초과';
  }

  private getNonHouseRateDescription(propertyType: string): string {
    switch (propertyType) {
      case 'land':
        return '토지';
      case 'commercial':
        return '상업용';
      case 'officetel':
        return '오피스텔';
      default:
        return '기타';
    }
  }
}

export const acquisitionTaxCalculator = new AcquisitionTaxCalculator();
