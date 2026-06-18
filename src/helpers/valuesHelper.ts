const toNumber = (value: unknown): number | null => {
 const n = Number(value);
 return Number.isFinite(n) ? n : null;
};

const format1DecimalWithoutTrailingZero = (value: number): string => {
 const fixed = value.toFixed(1);
 return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
};

const formatThousandsNoDecimals = (value: number): string =>
 new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  useGrouping: true,
 }).format(value);

export class ValuesHelper {
 getBigNumb(value: unknown): string {
  const n = toNumber(value);
  if (n === null) return '0';
  return n.toFixed(1);
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

 ifDecimalCeroGetIntegerQuantity(value: unknown): string {
  const n = toNumber(value);
  if (n === null) return '0';
  return formatThousandsNoDecimals(n);
 }

 getIntegerQuantityRoundedWithLongValues(value: unknown): string {
  const rounded = this.roundTwoDecimals(value);
  if (Number.isInteger(rounded)) {
   return String(Math.trunc(rounded));
  }
  return String(rounded);
 }

 getIntegerQuantityRounded(value: unknown): string {
  const rounded = this.roundTwoDecimals(value);
  if (Number.isInteger(rounded)) {
   return String(Math.trunc(rounded));
  }
  return String(rounded);
 }

 roundTwoDecimals(value: unknown): number {
  const n = toNumber(value);
  if (n === null) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
 }

 roundOneDecimal(value: unknown): number {
  const n = toNumber(value);
  if (n === null) return 0;
  return Math.round((n + Number.EPSILON) * 10) / 10;
 }

 roundAvoid(value: unknown, places: number): number {
  const n = toNumber(value);
  if (n === null) return 0;
  const scale = Math.pow(10, places);
  return Math.round(n * scale) / scale;
 }

 roundAvoidRetString(value: unknown, places: number): string {
  const n = toNumber(value);
  if (n === null) return '0';
  if (n % 1 === 0) {
   return this.getIntegerQuantityRoundedWithLongValues(n);
  }
  return String(this.roundAvoid(n, places));
 }

 roundAvoidReturnInteger(value: unknown, places: number): string {
  const n = toNumber(value);
  if (n === null) return '0';
  const rounded = this.roundAvoid(n, places);
  if (rounded === 0) return '0';
  return String(Math.trunc(rounded));
 }

 round(value: unknown, places: number): number {
  const n = toNumber(value);
  if (n === null) return 0;
  if (places < 0) {
   throw new Error('places must be >= 0');
  }
  const factor = Math.pow(10, places);
  return Math.round(n * factor) / factor;
 }
}

export const valuesHelper = new ValuesHelper();

export const formatAmount1Decimal = (value: unknown): string => valuesHelper.getBigNumb(value);

export const formatRate1Decimal = (value: unknown): string => {
 const n = toNumber(value);
 if (n === null) return '1';
 return format1DecimalWithoutTrailingZero(n);
};
