import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SessionService } from 'src/app/services/session.service';
import { ISessionDates } from './session-dates.interface';
import { ISessionFormByBookingProperties } from './session-form-by-booking.properties.inteface';

@Component({
  selector: 'app-session-form-by-booking',
  templateUrl: './session-form-by-booking.component.html',
  styleUrls: ['./session-form-by-booking.component.scss'],
})
export class SessionFormByBookingComponent implements OnInit, OnDestroy {
  sessionForm!: UntypedFormGroup;
  acceptButtonText = 'Ок';
  maxDateNgb?: NgbDate;
  todayNgb = this.calendar.getToday();
  selectedDate?: Date;
  session_duration?: number;
  session_end?: Date;
  session_begin?: Date;

  private bookingId!: number;

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
    private formBuilder: UntypedFormBuilder,
    private calendar: NgbCalendar,
    private cb: ChangeDetectorRef,
    private sessionService: SessionService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.setInitValuesToForm();
    this.subOnChangesTime();
  }

  private initForm(): void {
    this.sessionForm = this.formBuilder.group({
      time: [],
    });
  }

  subOnChangesTime() {
    this.sessionForm.controls.time.valueChanges.subscribe((time) => {
      this.updateSessionDates();
    });
  }

  updateSessionDates() {
    const time = this.sessionForm.controls.time.value;
    if (!this.selectedDate || !time) return;
    const { hour: h, minute: m } = time;
    this.session_begin = new Date(this.selectedDate);
    this.session_begin.setHours(h);
    this.session_begin.setMinutes(m);
    this.session_end = new Date(
      +this.session_begin + this.session_duration! * 1000 * 60
    );
  }

  onSelectDate($date: NgbDateStruct) {
    this.selectedDate = new Date($date.year, $date.month - 1, $date.day);
    this.updateSessionDates();
    this.getRemainingSessionsCountInDay();
    this.cb.detectChanges();
  }

  remainingCount$ = new BehaviorSubject<number>(0);

  getRemainingSessionsCountInDay() {
    this.sessionService
      .getRemainingSessionsInDate(this.selectedDate!.toJSON(), this.bookingId)
      .pipe(take(1))
      .subscribe(({ count }) => {
        this.remainingCount$.next(count);
      });
  }

  getBeginAndEndFromForm(): { begin: Date } | null {
    if (!this.selectedDate || !this.session_end) return null;
    return { begin: this.session_begin! };
  }

  setInitValuesToForm() {
    this.acceptButtonText = this.initValuesForForm.acceptButtonText ?? '';
    this.session_duration = this.initValuesForForm.session_duration;
    this.bookingId = this.initValuesForForm.bookingId;
    this.setMaxDate(this.initValuesForForm.booking_end!);
  }

  submit() {
    const dates = this.getBeginAndEndFromForm()!;
    this.onSubmit.emit(dates);
  }
}
