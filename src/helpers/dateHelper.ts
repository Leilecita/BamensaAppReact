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

type ParsedDateParts = {
 year: number;
 month: number;
 day: number;
 hour: number;
 minute: number;
 second: number;
};

const DATE_TIME_REGEX =
 /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;

const pad2 = (value: number): string => String(value).padStart(2, '0');

const isValidDate = (value: Date): boolean => !Number.isNaN(value.getTime());

const parseDateParts = (value?: string): ParsedDateParts | null => {
 if (!value) return null;
 const match = String(value).trim().match(DATE_TIME_REGEX);
 if (!match) return null;

 return {
  year: Number(match[1]),
  month: Number(match[2]),
  day: Number(match[3]),
  hour: Number(match[4] ?? '0'),
  minute: Number(match[5] ?? '0'),
  second: Number(match[6] ?? '0'),
 };
};

const parseLocalDate = (value?: string): Date | null => {
 const parts = parseDateParts(value);
 if (!parts) return null;

 const date = new Date(
  parts.year,
  parts.month - 1,
  parts.day,
  parts.hour,
  parts.minute,
  parts.second,
 );

 return isValidDate(date) ? date : null;
};

const parseUtcDate = (value?: string): Date | null => {
 const parts = parseDateParts(value);
 if (!parts) return null;

 const date = new Date(
  Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second),
 );

 return isValidDate(date) ? date : null;
};

const formatLocalDateTime = (value: Date): string => {
 return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())} ${pad2(value.getHours())}:${pad2(value.getMinutes())}:${pad2(value.getSeconds())}`;
};

const formatLocalDateTimeToShow = (value: Date): string => {
 return `${pad2(value.getDate())}-${pad2(value.getMonth() + 1)}-${value.getFullYear()} ${pad2(value.getHours())}:${pad2(value.getMinutes())}:${pad2(value.getSeconds())}`;
};

const formatUtcDateTime = (value: Date): string => {
 return `${value.getUTCFullYear()}-${pad2(value.getUTCMonth() + 1)}-${pad2(value.getUTCDate())} ${pad2(value.getUTCHours())}:${pad2(value.getUTCMinutes())}:${pad2(value.getUTCSeconds())}`;
};

export class DateHelper {
 static get(): DateHelper {
  return dateHelper;
 }

 getActualDate(value: Date = new Date()): string {
  return this.actualDate(value);
 }

 getActualDateToShow(value: Date = new Date()): string {
  return this.actualDateToShow(value);
 }

 getOnlyDate(date?: string): string {
  return this.onlyDate(date);
 }

 getOnlyDateComplete(date?: string): string {
  return this.onlyDateComplete(date);
 }

 getOnlyTime(date?: string): string {
  return this.onlyTime(date);
 }

 getOnlyTimeHour(date?: string): string {
  const time = this.onlyTime(date);
  return this.onlyHourMinut(time);
 }

 getNextDay(date?: string): string {
  return this.addUtcOffset(date, { days: 1 }, 'dd/MM/yyyy');
 }

 getPreviousDay(date?: string): string {
  return this.addUtcOffset(date, { days: -1 }, 'dd/MM/yyyy');
 }

 getPrevious10Day(date?: string): string {
  return this.addUtcOffset(date, { days: -10 }, 'dd/MM/yyyy');
 }

 getMoreSeconds(date?: string): string {
  return this.addUtcOffset(date, { seconds: 5 }, 'dd/MM/yyyy');
 }

 getMoreDays(date?: string): string {
  return this.addUtcOffset(date, { days: 7 }, 'dd/MM/yyyy');
 }

 changeOrderDate(date?: string): string {
  const parsed = parseLocalDate(date);
  return parsed ? formatLocalDateTimeToShow(parsed) : 'dd/MM/yyyy';
 }

 serverToUser(date?: string): string {
  const parsed = parseUtcDate(date);
  return parsed ? formatLocalDateTime(parsed) : '';
 }

 serverToUserFormatted(date?: string): string {
  const localDate = this.serverToUser(date);
  return localDate ? this.changeFormatDate(localDate) : '';
 }

 changeFormatDate(date?: string): string {
  const parsed = parseLocalDate(date);
  return parsed ? formatLocalDateTimeToShow(parsed) : 'dd/MM/yyyy';
 }

 onlyDateToShow(date?: string): string {
  const changed = this.changeFormatDate(date);
  const parts = changed.split(' ');
  return parts[0] ?? '';
 }

 compareDate(selectedPresentDate?: string): boolean {
  try {
   const today = this.actualDate2();
   const dateToday = this.onlyDate(today);
   const d1 = parseLocalDate(`${dateToday} 00:00:00`);
   const d2 = parseLocalDate(`${String(selectedPresentDate ?? '').trim()} 00:00:00`);
   if (!d1 || !d2) return false;

   if (d1.getTime() > d2.getTime()) return false;
   if (d1.getTime() < d2.getTime()) return true;
   return true;
  } catch {
   return false;
  }
 }

 userToServer(date?: string): string {
  const parsed = parseLocalDate(date);
  return parsed ? formatUtcDateTime(parsed) : '';
 }

 parseDate(date?: string): Date | null {
  return parseLocalDate(date);
 }

 onlyDate(date?: string): string {
  if (!date) return '';
  const parts = String(date).split(' ');
  return parts[0] ?? '';
 }

 onlyDayMonth(date?: string): string {
  if (!date) return '';
  const parts = String(date).split(' ');
  const partsDate = (parts[0] ?? '').split('-');
  return partsDate.length >= 3 ? `${partsDate[2]}-${partsDate[1]}` : '';
 }

 onlyDateComplete(date?: string): string {
  const part1 = this.onlyDate(date);
  return part1 ? `${part1} 00:00:00` : '';
 }

 onlyDayMonthComplete(date?: string): string {
  if (!date) return '';
  const partsDate = String(date).split('-');
  return partsDate.length >= 2 ? `${partsDate[0]}-${partsDate[1]}-01 00:00:00` : '';
 }

 getOnlymonth(date?: string): string {
  if (!date) return '';
  const parts = String(date).split('-');
  return parts.length >= 3 ? `${parts[2]}-${parts[1]}-00 00:00:00` : '';
 }

 getYear(date?: string): string {
  if (!date) return '';
  const parts = String(date).split('-');
  return parts[0] ?? '';
 }

 getDayMonth(date?: string): string {
  if (!date) return '--';
  const parts = String(date).split('-');
  return parts.length >= 3 ? `${parts[2].slice(0, 2)}/${parts[1]}` : '--';
 }

 numberDay(date?: string): string {
  const normalized = this.onlyDate(date);
  const parts = normalized.split('-');
  const day = parts[2] ?? '';
  if (!day) return '';
  return Number(day) < 10 ? day.substring(1) : day;
 }

 onlyDateHour(date?: string): string {
  const datePart = this.onlyDateToShow(date);
  const time = this.onlyHourMinut(this.onlyTime(date));
  return `${datePart} ${time}`.trim();
 }

 onlyHourMinut(time?: string): string {
  if (!time) return '';
  const parts = String(time).split(':');
  return parts.length > 1 ? `${parts[0]}:${parts[1]}` : '';
 }

 getNameMonth2(date?: string): string {
  const input = this.onlyDate(date);
  const parsed = parseLocalDate(`${input} 00:00:00`);
  return parsed ? MONTH_NAME_ES[parsed.getMonth()] : '';
 }

 getNameDay(date?: string): string {
  const inputDate = this.onlyDate(date);
  const parsed = parseLocalDate(`${inputDate} 00:00:00`);
  if (!parsed) return '';

  const englishDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parsed.getDay()];
  return this.getNamSpanish(englishDay);
 }

 getNamSpanish(dayEnglish?: string): string {
  const day = String(dayEnglish ?? '');

  if (day === 'Sun' || day === 'dom') return 'Dom';
  if (day === 'Mon' || day === 'lun') return 'Lun';
  if (day === 'Tue' || day === 'mar') return 'Mar';
  if (day === 'Wed' || day === 'mié') return 'Mie';
  if (day === 'Thu' || day === 'jue') return 'Jue';
  if (day === 'Fri' || day === 'vie') return 'Vie';
  if (day === 'Sat' || day === 'sáb') return 'Sab';
  return 'juernes';
 }

 formatOnlyDate(value?: string): string {
  return this.changeFormatDate(value);
 }

 formatDateTimeForDialog(value: Date = new Date()): string {
  return this.actualDateToShow(value);
 }

 formatDateTimeForPayload(value: Date = new Date()): string {
  return this.actualDate(value);
 }

 formatHeaderDateEs(dateKey: string): string {
  if (dateKey === 'Sin fecha') return dateKey;
  const parts = dateKey.split('-').map((item) => Number(item));
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return dateKey;

  const date = new Date(year, month - 1, day);
  return `${WEEKDAY_SHORT_ES[date.getDay()]} ${day} ${MONTH_NAME_ES[month - 1]}`;
 }

 formatHeaderMonthYearEs(dateKey: string): string {
  if (dateKey === 'Sin fecha') return dateKey;
  const parts = dateKey.split('-').map((item) => Number(item));
  const year = parts[0];
  const month = parts[1];
  if (!Number.isFinite(year) || !Number.isFinite(month)) return dateKey;
  return `${MONTH_NAME_ES[month - 1]} ${year}`;
 }

 private actualDate(value: Date = new Date()): string {
  return formatLocalDateTime(value);
 }

 private actualDateToShow(value: Date = new Date()): string {
  return formatLocalDateTimeToShow(value);
 }

 private actualDate2(): string {
  return this.actualDate(new Date());
 }

 private onlyTime(date?: string): string {
  if (!date) return '';
  const parts = String(date).split(' ');
  return parts.length > 1 ? parts[1] ?? '' : '';
 }

 private addUtcOffset(
  date: string | undefined,
  offset: { days?: number; seconds?: number },
  fallback: string,
 ): string {
  const parsed = parseUtcDate(date);
  if (!parsed) return fallback;

  if (offset.days) {
   parsed.setUTCDate(parsed.getUTCDate() + offset.days);
  }
  if (offset.seconds) {
   parsed.setUTCSeconds(parsed.getUTCSeconds() + offset.seconds);
  }

  return formatUtcDateTime(parsed);
 }
}

export const dateHelper = new DateHelper();

export const formatDateDdMmYyyy = (value?: string): string => dateHelper.formatOnlyDate(value);
