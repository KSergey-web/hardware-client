import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-range-date-picker',
  templateUrl: './range-date-picker.component.html',
  styleUrls: ['./range-date-picker.component.scss'],
})
export class RangeDatePickerComponent implements OnInit {
  @Input() begin?: Date;
  @Output() beginChange = new EventEmitter<Date>();
  @Input() end?: Date;
  @Output() endChange = new EventEmitter<Date>();

  hoveredDate: NgbDate | null = null;

  private _fromDate?: NgbDate;
  private _toDate!: NgbDate | null;

  get fromDate(): NgbDate | undefined {
    return this._fromDate;
  }
  set fromDate(date: NgbDate | undefined) {
    this._fromDate = date;
    this.changeBeginDate();
  }

  get toDate(): NgbDate | null {
    return this._toDate;
  }
  set toDate(date: NgbDate | null) {
    this._toDate = date;
    this.changeEndDate();
  }

  ngOnInit(): void {
    setTimeout(this.initFromDateAndToDate.bind(this));
  }

  initFromDateAndToDate() {
    if (this.begin && this.end) {
      this.fromDate = new NgbDate(
        this.begin.getFullYear(),
        this.begin.getMonth() + 1,
        this.begin.getDate()
      );
      this.toDate = new NgbDate(
        this.end.getFullYear(),
        this.end.getMonth() + 1,
        this.end.getDate()
      );
    } else {
      this.fromDate = this.calendar.getToday();
      this.toDate = null;
    }
  }

  constructor(private calendar: NgbCalendar) {}

  private changeBeginDate() {
    this.begin = new Date(
      this.fromDate!.year,
      this.fromDate!.month - 1,
      this.fromDate!.day
    );

    this.beginChange.emit(this.begin);
  }

  private changeEndDate() {
    if (!this.toDate) {
      this.end = this.begin;
    } else {
      this.end = new Date(
        this.toDate.year,
        this.toDate.month - 1,
        this.toDate.day
      );
    }
    this.end?.setHours(23);
    this.end?.setMinutes(59);
    this.end?.setSeconds(59);
    this.endChange.emit(this.end);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}
