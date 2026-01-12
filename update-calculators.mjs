import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

const CALC_DIR = './src/components/calculators';

// 이미 업데이트된 파일 (스킵)
const SKIP_FILES = [
  'AgeCalculator.tsx',
  'CapitalGainsTaxCalculator.tsx',
  'DateCalcCalculator.tsx',
  'DDayCalculator.tsx',
  'PregnancyCalculator.tsx',
  'SeveranceCalculator.tsx',
  'ZodiacCalculator.tsx',
  'SalaryCalculator.tsx',
  'LoanCalculator.tsx',
  'VATCalculator.tsx',
  'DiscountCalculator.tsx',
  'CompoundInterestCalculator.tsx',
];

// 금액 계산기 (MoneyInput 사용)
const MONEY_CALCULATORS = [
  'SavingsCalculator',
  'BrokerageFeeCalculator',
  'AcquisitionTaxCalculator',
  'CarTaxCalculator',
  'CreditCardCalculator',
  'ElectricityCalculator',
  'GasBillCalculator',
  'GiftTaxCalculator',
  'IncomeTaxCalculator',
  'ParentalLeaveCalculator',
  'PensionCalculator',
  'RentConversionCalculator',
  'ShippingCalculator',
  'StockReturnCalculator',
  'UnemploymentCalculator',
  'WaterBillCalculator',
  'UnitPriceCalculator',
  'TipCalculator',
  'PyeongCalculator',
];

async function processFile(filePath, fileName) {
  let content = await readFile(filePath, 'utf-8');
  const originalContent = content;
  const baseName = fileName.replace('.tsx', '');

  // 이미 UI 컴포넌트가 import되어 있으면 스킵
  if (content.includes('@/components/ui')) {
    console.log(`  [스킵] ${fileName} - 이미 업데이트됨`);
    return false;
  }

  // type="number" 또는 type="date"가 없으면 스킵
  if (!content.includes('type="number"') && !content.includes('type="date"')) {
    console.log(`  [스킵] ${fileName} - 숫자/날짜 입력 없음`);
    return false;
  }

  const isMoney = MONEY_CALCULATORS.includes(baseName);

  // Import 추가
  const importStatement = isMoney
    ? 'import { MoneyInput, NumberInput, PercentInput } from "@/components/ui";'
    : 'import { NumberInput, PercentInput } from "@/components/ui";';

  // useState import 뒤에 추가
  if (content.includes('import { useState }')) {
    content = content.replace(
      'import { useState }',
      'import { useState }'
    );
    // "use client"; 다음에 import 추가
    content = content.replace(
      /("use client";\s*\n)/,
      `$1\n${importStatement}\n`
    );
  } else if (content.includes('import { useState,')) {
    content = content.replace(
      /("use client";\s*\n)/,
      `$1\n${importStatement}\n`
    );
  }

  if (content === originalContent) {
    console.log(`  [실패] ${fileName} - 변경 없음`);
    return false;
  }

  await writeFile(filePath, content);
  console.log(`  [완료] ${fileName} - import 추가됨`);
  return true;
}

async function main() {
  console.log('계산기 업데이트 시작...\n');

  const dirs = await readdir(CALC_DIR);
  let updated = 0;
  let skipped = 0;

  for (const dir of dirs) {
    const dirPath = join(CALC_DIR, dir);
    try {
      const files = await readdir(dirPath);
      for (const file of files) {
        if (!file.endsWith('.tsx')) continue;
        if (SKIP_FILES.includes(file)) {
          console.log(`  [스킵] ${file} - 이미 처리됨`);
          skipped++;
          continue;
        }

        const filePath = join(dirPath, file);
        const result = await processFile(filePath, file);
        if (result) updated++;
        else skipped++;
      }
    } catch {
      // 디렉토리가 아닌 경우 무시
    }
  }

  console.log(`\n완료: ${updated}개 업데이트, ${skipped}개 스킵`);
}

main().catch(console.error);
