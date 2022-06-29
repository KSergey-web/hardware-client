import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ISessionDates } from './session-dates.interface';
import { ISessionFormByBookingProperties } from './session-form-by-booking.properties.inteface';

@Component({
  selector: 'app-session-form-by-booking',
  templateUrl: './session-form-by-booking.component.html',
  styleUrls: ['./session-form-by-booking.component.scss'],
})
export class SessionFormByBookingComponent implements OnInit, OnDestroy {
  sessionForm!: FormGroup;
  acceptButtonText = 'Ок';
  maxDateNgb?: NgbDate;
  todayNgb = this.calendar.getToday();
  selectedDate?: Date;
  session_duration?: number;
  session_end?: Date;

  setMaxDate(booking_end: Date) {
    this.maxDateNgb = new NgbDate(
      booking_end.getFullYear(),
      booking_end.getMonth() + 1,
      booking_end.getDate()
    );
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  @Input() initValuesForForm!: ISessionFormByBookingProperties;
  @Output() onSubmit = new EventEmitter<ISessionDates>();

  constructor(
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar,
    private cb: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.setInitValuesToForm();
    this.subOnChangesTime();
  }

  private initForm(): void {
    this.sessionForm = this.formBuilder.group({
      time: [{ minute: 0, hour: 0 }],
    });
  }

  subOnChangesTime() {
    this.sessionForm.controls.time.valueChanges.subscribe((time) => {
      if (!this.selectedDate) return;
      const { hour: h, minute: m } = time;
      const begin = new Date(this.selectedDate);
      begin.setHours(h);
      begin.setMinutes(m);
      this.session_end = new Date(+begin + this.session_duration! * 1000 * 60);
    });
  }

  onSelectDate($date: NgbDateStruct) {
    this.selectedDate = new Date($date.year, $date.month - 1, $date.day);
    this.cb.detectChanges();
  }

  getBeginAndEndFromForm(): { begin: Date; end: Date } | null {
    if (!this.selectedDate || !this.session_end) return null;
    return { begin: new Date(this.selectedDate), end: this.session_end };
  }

  calculateEnd() {
    const time = this.sessionForm.controls.time.value;
  }

  setInitValuesToForm() {
    this.acceptButtonText = this.initValuesForForm.acceptButtonText ?? '';
    this.session_duration = this.initValuesForForm.session_duration;
    this.setMaxDate(this.initValuesForForm.booking_end!);
  }

  submit() {
    const dates = this.getBeginAndEndFromForm()!;
    this.onSubmit.emit(dates);
  }
}
