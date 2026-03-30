const toNumber = (value: unknown): number | null => {
 const n = Number(value);
 return Number.isFinite(n) ? n : null;
};

const format1DecimalWithoutTrailingZero = (value: number): string => {
 const fixed = value.toFixed(1);
 return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
};

export class ValuesHelper {
 getBigNumb(value: unknown): string {
  const n = toNumber(value);
  if (n === null) return '0';
  return format1DecimalWithoutTrailingZero(n);
 }

 getBigNumb2(value: unknown): string {
  const n = toNumber(value);
  if (n === null) return '0';
  return String(n);
 }

 getBigNumbNoDecimal(value: unknown): string {
  const n = toNumber(value);
  if (n === null) return '0';
  return String(Math.trunc(n));
 }

 roundTwoDecimals(value: unknown): number {
  const n = toNumber(value);
  if (n === null) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
 }
}

export const valuesHelper = new ValuesHelper();

export const formatAmount1Decimal = (value: unknown): string => valuesHelper.getBigNumb(value);

export const formatRate1Decimal = (value: unknown): string => {
 const n = toNumber(value);
 if (n === null) return '1';
 return format1DecimalWithoutTrailingZero(n);
};
