import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  getInterval(startDate: string, finishDate: string) {
    const reportPeriod =
      formatDate(startDate, 'dd.MM.YYYY', this.locale) +
      ' - ' +
      formatDate(finishDate, 'dd.MM.YYYY', this.locale);
    return reportPeriod;
  }

  getDate(date: string) {
    const formattedDate = formatDate(date, 'dd.MM.YYYY', this.locale);
    return formattedDate;
  }

  getMonth(date: string) {
    const formattedDate = formatDate(date, 'MM.YYYY', this.locale);
    return formattedDate;
  }

  getIntervalMonths(startDate: string, finishDate: string) {
    const reportPeriod =
      formatDate(startDate, 'MMMM YYYY', this.locale) +
      ' г.' +
      ' - ' +
      formatDate(finishDate, 'MMMM YYYY', this.locale) +
      ' г.';
    return reportPeriod;
  }

  getIntervalMonthsShort(startDate: string, finishDate: string) {
    const reportPeriod =
      formatDate(startDate, 'MM.YYYY', this.locale) +
      ' г.' +
      ' - ' +
      formatDate(finishDate, 'MM.YYYY', this.locale) +
      ' г.';
    return reportPeriod;
  }

  getFormattedDateTime(date: string, format = 'dd.MM.YYYY HH:mm:ss'): string {
    return formatDate(date, format, this.locale);
  }
}
