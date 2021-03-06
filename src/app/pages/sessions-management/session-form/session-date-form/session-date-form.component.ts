import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEquipment } from 'src/app/interfaces/equipment.interface';
import { ISession } from 'src/app/interfaces/session.interface';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-session-date-form',
  templateUrl: './session-date-form.component.html',
  styleUrls: ['./session-date-form.component.scss'],
})
export class SessionDateFormComponent implements OnInit, OnDestroy {
  sessionDateForm!: FormGroup;
  selectedDate?: Date;
  sessions: ISession[] = [];
  selectedEquipment?: IEquipment;
  isBusyTimeInterval: boolean = false;
  isPast: boolean = false;
  maxDateNgb = this.ngbCalendar.getNext(this.ngbCalendar.getToday(), 'd', 7);
  todayNgb = this.ngbCalendar.getToday();

  @Input() equipmentChanged$!: Observable<IEquipment>;
  @Input() editedSession: ISession | null = null;
  @Output() onSelectedDates = new EventEmitter<{ begin: Date; end: Date }>();

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private ngbCalendar: NgbCalendar
  ) {
    this.sessionDateForm = formBuilder.group({
      duration: [
        5,
        [Validators.required, Validators.min(5), Validators.max(1440)],
      ],
      time: [{ minute: 0, hour: 0 }],
    });
  }

  private onDestroy$ = new Subject<boolean>();

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  onSelectDate($date: NgbDateStruct) {
    this.getSessionsInDateByEquipment($date);
  }

  private setSelectedDate(ngbDate: NgbDateStruct): void {
    this.selectedDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  }

  private getSessionsInDateByEquipment(newDate?: NgbDateStruct) {
    if (newDate) {
      this.setSelectedDate(newDate);
    } else if (!this.selectedDate) {
      return;
    }
    this.sessionService
      .getSessionsInDateByEquipment(this.selectedEquipment!, this.selectedDate!)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((sessions: ISession[]) => {
        if (this.editedSession) {
          sessions = sessions.filter(
            (session) => session.id !== this.editedSession?.id
          );
        }
        this.sessions = sessions;
      });
  }

  getBeginAndEndFromForm(): { begin: Date; end: Date } | null {
    if (!this.selectedDate) {
      return null;
    }
    const { hour: h, minute: m } = this.sessionDateForm.controls.time.value;
    const duration: number = this.sessionDateForm.value.duration;
    const begin = new Date(this.selectedDate);
    begin.setHours(h);
    begin.setMinutes(m);
    const end = new Date(+begin + duration * 1000 * 60);
    return { begin, end };
  }

  isBeginInPast(begin: Date): boolean {
    if (begin < new Date()) {
      this.isPast = true;
    } else {
      this.isPast = false;
    }
    return this.isPast;
  }

  isTimeIntervalBusy(begin: Date, end: Date): boolean {
    const ind = this.sessions.find((session: ISession) => {
      if (
        (session.begin <= begin && session.end >= begin) ||
        (session.begin <= end && session.end >= end)
      ) {
        return true;
      }
      return false;
    });
    if (ind) this.isBusyTimeInterval = true;
    else this.isBusyTimeInterval = false;
    return this.isBusyTimeInterval;
  }

  submit(): void {
    const res = this.getBeginAndEndFromForm();
    if (!res) return;
    const { begin, end } = res;
    if (this.isBeginInPast(begin)) return;
    if (this.isTimeIntervalBusy(begin, end)) return;
    this.onSelectedDates.emit({ begin, end });
  }

  ngOnInit(): void {
    this.equipmentChanged$.pipe(takeUntil(this.onDestroy$)).subscribe((eq) => {
      this.selectedEquipment = eq;
      this.getSessionsInDateByEquipment();
    });
  }
}
