const WEEKDAY_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'] as const;
const MONTH_NAME_ES = [
 'Enero',
 'Febrero',
 'Marzo',
 'Abril',
 'Mayo',
 'Junio',
 'Julio',
 'Agosto',
 'Septiembre',
 'Octubre',
 'Noviembre',
 'Diciembre',
] as const;

export class DateHelper {
 getActualDate(value: Date = new Date()): string {
  return this.formatDateTimeForPayload(value);
 }

 getActualDateToShow(value: Date = new Date()): string {
  return this.formatDateTimeForDialog(value);
 }

 formatOnlyDate(value?: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
 }

 formatDateTimeForDialog(value: Date = new Date()): string {
  const dd = String(value.getDate()).padStart(2, '0');
  const mm = String(value.getMonth() + 1).padStart(2, '0');
  const yyyy = value.getFullYear();
  const hh = String(value.getHours()).padStart(2, '0');
  const min = String(value.getMinutes()).padStart(2, '0');
  const sec = String(value.getSeconds()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${sec}`;
 }

 formatDateTimeForPayload(value: Date = new Date()): string {
  const dd = String(value.getDate()).padStart(2, '0');
  const mm = String(value.getMonth() + 1).padStart(2, '0');
  const yyyy = value.getFullYear();
  const hh = String(value.getHours()).padStart(2, '0');
  const min = String(value.getMinutes()).padStart(2, '0');
  const sec = String(value.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
 }

 getDayMonth(value?: string): string {
  if (!value) return '--';
  const [datePart] = String(value).split(' ');
  const parts = datePart?.split('-') ?? [];
  if (parts.length !== 3) return '--';
  return `${parts[2]}-${parts[1]}`;
 }

 formatHeaderDateEs(dateKey: string): string {
  if (dateKey === 'Sin fecha') return dateKey;
  const parts = dateKey.split('-').map((item) => Number(item));
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return dateKey;

  const date = new Date(year, month - 1, day);
  return `${WEEKDAY_SHORT_ES[date.getDay()]} ${day} ${MONTH_NAME_ES[month - 1]} ${year}`;
 }

 formatHeaderMonthYearEs(dateKey: string): string {
  if (dateKey === 'Sin fecha') return dateKey;
  const parts = dateKey.split('-').map((item) => Number(item));
  const year = parts[0];
  const month = parts[1];
  if (!Number.isFinite(year) || !Number.isFinite(month)) return dateKey;
  return `${MONTH_NAME_ES[month - 1]} ${year}`;
 }
}

export const dateHelper = new DateHelper();

export const formatDateDdMmYyyy = (value?: string): string => dateHelper.formatOnlyDate(value);
